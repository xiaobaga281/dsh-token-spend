/**
 * dsh-token-spend Host half.
 *
 * Aggregates token usage from the only source of truth the harness has: the
 * committed session logs. Every `assistant/message` event carries the provider
 * `usage` for that model call, so the page derives everything without touching
 * provider billing or a second database.
 *
 * Two accuracy rules drive the fold:
 *
 *  1. A model call is billed once. Seeded/forked/subagent sessions copy the
 *     inherited event prefix into their own log, so the same `message.id` can
 *     appear in several files. Usage is keyed by that id and counted once.
 *  2. `inputTokens` does NOT include cache reads. When the provider reports
 *     `totalTokens` it equals input + output + cacheRead + cacheWrite, so that
 *     all-in figure is what this page sums. Cache reads are 16x the fresh input
 *     on real logs; using input + output alone would understate usage by ~94%.
 *
 * Folds are cached per session against `snapshot.revision`, an opaque change
 * token the persistence service provides exactly for derived read models, so a
 * refresh only re-reads logs that actually changed.
 *
 * Deleted sessions: a permanent delete removes the whole session-log directory,
 * so a purely log-derived total silently rewrites history (spend shrinks because
 * a conversation was deleted). To keep the page an honest ledger, this plugin
 * keeps its own day-level copy of what it has already seen under
 * `<DSH_HOME>/storages/token-spend/ledger.json` — per day, per session, and per
 * model counters only: never titles, paths, or message content. A session that
 * is gone keeps contributing what it had already recorded, and the page reports
 * that share separately so nothing is silently inflated.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const ROUTE = '/token-spend/summary';
/** Sessions folded at once: enough to stay fast without a memory spike. */
const READ_CONCURRENCY = 4;
/** Give up on one unreadable/huge session rather than stalling the page. */
const READ_TIMEOUT_MS = 25_000;
const CACHE_TTL_MS = 30_000;
/** The durable day ledger; only counters, keyed by day and session id. */
const LEDGER_VERSION = 1;

export function apply(ctx, config) {
  const settings = {
    budgetTokens: 0,
    cacheTtlMs: CACHE_TTL_MS,
    // Keep the recorded usage of deleted sessions (the point of the ledger).
    retainDeleted: true,
    ledgerPath: '',
    ...(config ?? {}),
  };
  // session id -> { revision, fold }. Survives across requests, so an unchanged
  // log is never folded twice.
  const folds = new Map();
  ctx.inject(['webServer', 'sessionPersistence'], (hctx) => {
    hctx.effect(() => {
      const cache = { at: 0, pending: undefined, value: undefined };
      const dispose = hctx.webServer.register({
        kind: 'exact',
        path: ROUTE,
        handler: async (request, response) => {
          const rejection = requestRejection(hctx, request);
          if (rejection !== undefined) {
            sendJson(response, rejection, { ok: false, error: 'forbidden' });
            return;
          }
          if (request.method !== 'GET') {
            sendJson(response, 405, { ok: false, error: 'method-not-allowed' });
            return;
          }
          const url = new URL(request.url ?? '/', 'http://localhost');
          const refresh = url.searchParams.get('refresh') === '1';
          try {
            sendJson(response, 200, { ok: true, ...(await readAggregate(hctx, settings, cache, folds, refresh)) });
          } catch (error) {
            sendJson(response, 200, { ok: false, error: errorMessage(error) });
          }
        },
      });
      return () => {
        cache.value = undefined;
        cache.pending = undefined;
        dispose();
      };
    }, 'dsh-token-spend: usage route');
  });
}

function requestRejection(ctx, request) {
  try {
    const connection = ctx.get?.('connection');
    const rejection = connection?.requestRejection?.(request);
    return typeof rejection === 'number' ? rejection : undefined;
  } catch {
    return 403;
  }
}

async function readAggregate(ctx, settings, cache, folds, refresh) {
  const now = Date.now();
  if (!refresh && cache.value !== undefined && now - cache.at < settings.cacheTtlMs) {
    return { ...cache.value, cached: true };
  }
  if (!refresh && cache.pending !== undefined) return cache.pending;
  const pending = collect(ctx, settings, folds).then((value) => {
    cache.value = value;
    cache.at = Date.now();
    return { ...value, cached: false };
  }).finally(() => {
    if (cache.pending === pending) cache.pending = undefined;
  });
  cache.pending = pending;
  return pending;
}

/**
 * Fold every stored session into:
 *  - `totals`   all-time counters (all-in tokens, split by source)
 *  - `days`     one bucket per local calendar day, ascending, with its models
 *  - `sessions` one row per session with its own per-day breakdown
 *  - `models`   per-model totals so the page can attribute spend
 *  - `today`    the current day plus yesterday, for the headline comparison
 */
async function collect(ctx, settings, folds) {
  const snapshots = await ctx.sessionPersistence.list();
  // Deterministic order: the same duplicated call always lands in the same
  // session row, so the per-session table does not shuffle between refreshes.
  const ordered = [...snapshots].sort((a, b) => {
    const created = Number(a.header.createdAt ?? 0) - Number(b.header.createdAt ?? 0);
    return created !== 0 ? created : String(a.header.id).localeCompare(String(b.header.id));
  });

  const live = new Set();
  const foldsForRun = new Array(ordered.length);
  let cursor = 0;
  const worker = async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= ordered.length) return;
      const snapshot = ordered[index];
      const id = snapshot.header.id;
      live.add(id);
      const cached = folds.get(id);
      if (cached !== undefined && cached.revision === snapshot.revision) {
        foldsForRun[index] = cached.fold;
        continue;
      }
      const fold = await foldSession(ctx, snapshot);
      foldsForRun[index] = fold;
      if (fold !== undefined) folds.set(id, { revision: snapshot.revision, fold });
    }
  };
  await Promise.all(Array.from({ length: Math.min(READ_CONCURRENCY, ordered.length) }, worker));

  // Drop folds of sessions that are gone, so the map cannot grow forever.
  for (const id of [...folds.keys()]) if (!live.has(id)) folds.delete(id);

  // Phase 1: one row per live session, with that session's per-day counters.
  const kept = [];
  const seenCalls = new Set();
  let skipped = 0;
  let duplicates = 0;

  for (const fold of foldsForRun) {
    if (fold === undefined) {
      skipped += 1;
      continue;
    }
    const row = {
      id: fold.id,
      title: fold.title,
      cwd: fold.cwd,
      createdAt: fold.createdAt,
      firstAt: null,
      lastAt: null,
      ...emptyCounters(),
      days: {},
    };
    const rowDays = new Map();

    for (const record of fold.records) {
      // One billed call. The inherited copies carry the same message id.
      if (record.messageId !== null) {
        if (seenCalls.has(record.messageId)) {
          duplicates += 1;
          continue;
        }
        seenCalls.add(record.messageId);
      }

      addCounters(row, record);
      if (row.firstAt === null || record.time < row.firstAt) row.firstAt = record.time;
      if (row.lastAt === null || record.time > row.lastAt) row.lastAt = record.time;

      const rowDay = rowDays.get(record.date) ?? { date: record.date, ...emptyCounters(), models: new Map() };
      addCounters(rowDay, record);
      addModelCounters(rowDay.models, record.model, record);
      rowDays.set(record.date, rowDay);
    }

    if (row.calls <= 0) continue;
    for (const [date, rowDay] of rowDays) {
      row.days[date] = {
        ...finalizeCounters(rowDay),
        models: [...rowDay.models.values()].map(finalizeModel).sort(byTotalDesc),
      };
    }
    kept.push(row);
  }

  // Phase 2: merge the live rows into the durable ledger. A day keeps every
  // session id it has ever seen, so a deleted session's usage survives; a live
  // session always replaces its own recorded value, so nothing double counts.
  const previous = await loadLedger(settings);
  const merged = new Map();
  for (const row of kept) {
    for (const [date, day] of Object.entries(row.days)) {
      const bucket = merged.get(date) ?? new Map();
      bucket.set(String(row.id), toLedgerEntry(day));
      merged.set(date, bucket);
    }
  }
  const retained = new Set();
  if (settings.retainDeleted !== false) {
    for (const [date, entry] of Object.entries(previous.days ?? {})) {
      const bucket = merged.get(date) ?? new Map();
      for (const [sid, sessions] of Object.entries(entry?.sessions ?? {})) {
        if (bucket.has(sid)) continue;
        bucket.set(sid, sessions);
        retained.add(sid);
      }
      merged.set(date, bucket);
    }
  }

  // Phase 3: rebuild every surface from the merged map, so totals, the heatmap,
  // the model split and the per-day detail all include what was retained.
  const totals = emptyCounters();
  const models = new Map();
  const days = new Map();
  let retainedTotal = 0;

  for (const [date, bucket] of merged) {
    const day = { date, ...emptyCounters(), sessionCount: bucket.size, models: new Map(), dayDeletedSessions: 0, dayDeletedTotal: 0 };
    for (const [sid, entry] of bucket) {
      addCounters(day, entry.counters);
      addCounters(totals, entry.counters);
      for (const [model, counters] of Object.entries(entry.models ?? {})) {
        addModelCounters(day.models, model, counters);
        addModelCounters(models, model, counters);
      }
      if (retained.has(sid)) {
        day.dayDeletedSessions += 1;
        day.dayDeletedTotal += entry.counters.total;
        retainedTotal += entry.counters.total;
      }
    }
    days.set(date, day);
  }

  await saveLedger(settings, merged);

  const dayList = [...days.values()]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((bucket) => ({
      date: bucket.date,
      ...finalizeCounters(bucket),
      sessionCount: bucket.sessionCount,
      deletedSessions: bucket.dayDeletedSessions,
      deletedTotal: bucket.dayDeletedTotal,
      models: [...bucket.models.values()].map(finalizeModel).sort(byTotalDesc),
    }));

  const todayKey = localDateKey(Date.now());
  const yesterdayKey = localDateKey(Date.now() - 86_400_000);
  const todayBucket = days.get(todayKey);
  const yesterdayBucket = days.get(yesterdayKey);

  return {
    generatedAt: Date.now(),
    budget: resolveBudget(settings, dayList, todayBucket?.total ?? 0),
    totals: finalizeCounters(totals),
    cacheHitRate: cacheHit(totals),
    days: dayList,
    sessions: kept.sort(byTotalDesc),
    models: [...models.values()].map(finalizeModel).sort(byTotalDesc),
    sessionCount: kept.length,
    skipped,
    duplicates,
    retainedDeleted: { sessions: retained.size, total: retainedTotal },
    today: {
      date: todayKey,
      total: todayBucket?.total ?? 0,
      calls: todayBucket?.calls ?? 0,
      previous: yesterdayBucket?.total ?? 0,
    },
  };
}

function emptyCounters() {
  return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, total: 0, calls: 0 };
}

/** Counters only, so a ledger entry never carries presentation fields. */
function countersOnly(source) {
  return {
    input: source.input ?? 0,
    output: source.output ?? 0,
    cacheRead: source.cacheRead ?? 0,
    cacheWrite: source.cacheWrite ?? 0,
    reasoning: source.reasoning ?? 0,
    total: source.total ?? 0,
    calls: source.calls ?? 0,
  };
}

/** One finalized session-day row → the durable shape (counters + per-model counters). */
function toLedgerEntry(day) {
  const models = {};
  for (const entry of day.models ?? []) {
    if (typeof entry?.model !== 'string') continue;
    models[entry.model] = countersOnly(entry);
  }
  return { counters: countersOnly(day), models };
}

/** `<DSH_HOME>/storages/token-spend/ledger.json`, or the configured override. */
function ledgerFile(settings) {
  if (typeof settings.ledgerPath === 'string' && settings.ledgerPath.length > 0) return settings.ledgerPath;
  const home = process.env.DSH_HOME && process.env.DSH_HOME.length > 0
    ? process.env.DSH_HOME
    : path.join(os.homedir(), '.dsh');
  return path.join(home, 'storages', 'token-spend', 'ledger.json');
}

/**
 * Load the day ledger. A missing, unreadable or older-format file means "nothing
 * recorded yet": the page keeps working from live logs and rewrites the file.
 */
async function loadLedger(settings) {
  try {
    const text = await fs.readFile(ledgerFile(settings), 'utf8');
    const parsed = JSON.parse(text);
    if (parsed?.version !== LEDGER_VERSION || typeof parsed.days !== 'object' || parsed.days === null) {
      return { version: LEDGER_VERSION, days: {} };
    }
    return parsed;
  } catch {
    return { version: LEDGER_VERSION, days: {} };
  }
}

/** Write the ledger atomically: a torn write must never erase recorded usage. */
async function saveLedger(settings, merged) {
  const days = {};
  for (const [date, bucket] of merged) {
    const sessions = {};
    for (const [sid, entry] of bucket) sessions[sid] = entry;
    days[date] = { sessions };
  }
  const payload = { version: LEDGER_VERSION, updatedAt: Date.now(), days };
  const file = ledgerFile(settings);
  const temporary = `${file}.${process.pid}.tmp`;
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(temporary, JSON.stringify(payload), 'utf8');
    await fs.rename(temporary, file);
  } catch {
    // A read-only home or a locked file must not break the page; the next
    // refresh retries and the in-process folds still answer the request.
    try { await fs.rm(temporary, { force: true }); } catch {}
  }
}

function addCounters(target, source) {
  target.input += source.input;
  target.output += source.output;
  target.cacheRead += source.cacheRead;
  target.cacheWrite += source.cacheWrite;
  target.reasoning += source.reasoning;
  target.total += source.total;
  target.calls += source.calls;
}

function addModelCounters(map, model, source) {
  const slot = map.get(model) ?? { model, ...emptyCounters() };
  addCounters(slot, source);
  map.set(model, slot);
}

function finalizeCounters(counters) {
  return {
    input: counters.input,
    output: counters.output,
    cacheRead: counters.cacheRead,
    cacheWrite: counters.cacheWrite,
    reasoning: counters.reasoning,
    total: counters.total,
    calls: counters.calls,
  };
}

/** A counter row that also carries its model id, for per-model breakdowns. */
function finalizeModel(counters) {
  return {
    model: typeof counters.model === 'string' && counters.model.length > 0 ? counters.model : 'unknown',
    ...finalizeCounters(counters),
  };
}

function byTotalDesc(a, b) {
  return b.total - a.total;
}

/**
 * Read one session and return its usage records, title and span. `undefined`
 * means the log could not be read; the caller only counts it as skipped.
 *
 * Records stay unaggregated so the global pass can drop duplicated calls before
 * deciding which session owns them.
 */
async function foldSession(ctx, snapshot) {
  const id = snapshot.header.id;
  let events;
  try {
    events = await withTimeout(readEvents(ctx, id), READ_TIMEOUT_MS);
  } catch {
    return undefined;
  }
  if (!Array.isArray(events)) return undefined;

  const records = [];
  let title = null;
  let titleSeq = -1;

  for (const event of events) {
    if (event?.type === 'session/title') {
      const text = event.data?.title;
      // Titles are re-folded: the highest seq wins, matching the log's own
      // latest-title semantics.
      if (typeof text === 'string' && text.length > 0 && Number(event.seq) >= titleSeq) {
        title = text;
        titleSeq = Number(event.seq);
      }
      continue;
    }
    if (event?.type !== 'assistant/message') continue;
    const data = event.data ?? {};
    const usage = data.usage;
    if (!usage) continue;

    const input = num(usage.inputTokens);
    const output = num(usage.outputTokens);
    const cacheRead = num(usage.cacheReadTokens);
    const cacheWrite = num(usage.cacheWriteTokens);
    const reasoning = num(usage.reasoningTokens);
    // All-in, matching the provider's own totalTokens (verified equal on every
    // log that reports one). The fallback keeps providers without the field
    // consistent with the ones that have it.
    const reported = num(usage.totalTokens);
    const total = reported > 0 ? reported : input + output + cacheRead + cacheWrite;
    const source = data.message?.source ?? {};
    const model = typeof source.model === 'string' && source.model.length > 0 ? source.model : 'unknown';
    const time = Number.isFinite(event.time) ? event.time : Number(snapshot.header.createdAt ?? Date.now());

    records.push({
      messageId: typeof data.message?.id === 'string' && data.message.id.length > 0 ? data.message.id : null,
      time,
      date: localDateKey(time),
      model,
      input,
      output,
      cacheRead,
      cacheWrite,
      reasoning,
      total,
      calls: 1,
    });
  }

  return {
    id,
    title,
    cwd: snapshot.header.cwd ?? null,
    createdAt: snapshot.header.createdAt ?? null,
    records,
  };
}

/**
 * Read one session's raw events through a read handle: no replay validation,
 * because usage folding needs no derived surface. The handle is always closed.
 */
async function readEvents(ctx, id) {
  const handle = await ctx.sessionPersistence.open(id, 'read');
  try {
    const result = await handle.read();
    return Array.isArray(result?.events) ? result.events : [];
  } catch {
    return undefined;
  } finally {
    try { await handle.close(); } catch {}
  }
}

/**
 * Budget is a daily one: `used` is today's all-in usage, so the bar answers
 * "how much of a normal day have I spent". An explicit `budgetTokens` wins;
 * otherwise it is derived from the busiest day.
 */
function resolveBudget(settings, days, usedToday) {
  const configured = Number(settings.budgetTokens);
  if (Number.isFinite(configured) && configured > 0) {
    return { tokens: configured, source: 'config', used: usedToday };
  }
  let peak = 0;
  for (const day of days) if (day.total > peak) peak = day.total;
  if (peak <= 0) return { tokens: 0, source: 'auto', used: usedToday };
  const target = peak * 1.25;
  const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(target)) - 1);
  let tokens = Math.ceil(target / magnitude) * magnitude;
  if (tokens <= peak) tokens = peak * 2;
  return { tokens, source: 'auto', used: usedToday };
}

/** Share of prompt tokens served from cache. Cache writes are prompt tokens too. */
function cacheHit(counters) {
  const prompt = counters.cacheRead + counters.input + counters.cacheWrite;
  return prompt > 0 ? counters.cacheRead / prompt : 0;
}

function num(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

/** Local calendar day (`YYYY-MM-DD`) — the page groups by the user's own day. */
function localDateKey(time) {
  const date = new Date(time);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

async function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(undefined), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
