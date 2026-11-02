window.__ModuleLoader__.load({
  id: '@local/dsh-token-spend',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const PLUGIN_ID = '@local/dsh-token-spend';
    const NS = 'dsh-token-spend';

    const dicts = {
      zh: {
        nav: '花费',
        title: '花费',
        subtitle: '每日用量 · 缓存效率',
        totalAllIn: '总处理量',
        totalAllInHint: '输入 + 缓存读取 + 缓存写入 + 输出',
        today: '今日用量',
        vsYesterday: '较昨日',
        yesterdayNone: '昨日无记录',
        composition: '用量构成',
        share: '占比',
        trend: '最近 14 天',
        merged: '已按消息 ID 合并 {n} 条重复记录',
        retained: '含已删除会话 {n} 个 · 已保留 {tokens}',
        dayRetained: '其中已删除会话 {n} 个 · {tokens}',
        tokens: 'tokens',
        budget: '预算',
        heatmap: '每日用量热力图',
        heatmapHint: '点击色块查看当天明细',
        legendLow: '低',
        legendMid: '中',
        legendHigh: '高',
        legendPeak: '峰值',
        avg7: '7 日平均',
        peakDay: '峰值日',
        cacheHit: '缓存命中率',
        noSelection: '选择一个日期查看明细',
        inputTokens: '输入',
        outputTokens: '输出',
        cacheRead: '缓存读取',
        cacheWrite: '缓存写入',
        reasoning: '推理',
        calls: '请求数',
        daySessions: '当天会话',
        models: '模型分布',
        session: '会话',
        dayTotal: '当天',
        model: '模型',
        empty: '还没有可统计的用量记录，开始一次对话即可。',
        loading: '正在统计本机的会话日志…',
        loadFailed: '加载失败：',
        refresh: '刷新',
        sessions: '{n} 个会话',
        skipped: '（{n} 个会话日志无法读取，已跳过）',
        lastUpdated: '更新于 {time}',
        noUsageThatDay: '当天没有用量记录',
        weekdayMon: '一',
        weekdayWed: '三',
        weekdayFri: '五',
        prevDay: '前一天',
        nextDay: '后一天',
        latestDay: '最近一天',
      },
      en: {
        nav: 'Spend',
        title: 'Spend',
        subtitle: 'Daily usage · cache efficiency',
        totalAllIn: 'Total processed',
        totalAllInHint: 'input + cache read + cache write + output',
        today: 'Today',
        vsYesterday: 'vs yesterday',
        yesterdayNone: 'nothing yesterday',
        composition: 'Composition',
        share: 'share',
        trend: 'Last 14 days',
        merged: '{n} duplicate records merged by message id',
        retained: 'includes {n} deleted sessions · {tokens} retained',
        dayRetained: '{n} deleted sessions · {tokens}',
        tokens: 'tokens',
        budget: 'Budget',
        heatmap: 'Daily usage heatmap',
        heatmapHint: 'Click a cell for its detail',
        legendLow: 'Low',
        legendMid: 'Mid',
        legendHigh: 'High',
        legendPeak: 'Peak',
        avg7: '7-day average',
        peakDay: 'Peak day',
        cacheHit: 'Cache hit rate',
        noSelection: 'Pick a date to inspect it',
        inputTokens: 'Input',
        outputTokens: 'Output',
        cacheRead: 'Cache read',
        cacheWrite: 'Cache write',
        reasoning: 'Reasoning',
        calls: 'Requests',
        daySessions: 'Sessions that day',
        models: 'By model',
        session: 'Session',
        dayTotal: 'That day',
        model: 'Model',
        empty: 'No usage recorded yet — start a conversation first.',
        loading: 'Folding local session logs…',
        loadFailed: 'Failed to load: ',
        refresh: 'Refresh',
        sessions: '{n} sessions',
        skipped: ' ({n} unreadable session logs skipped)',
        lastUpdated: 'updated {time}',
        noUsageThatDay: 'No usage recorded that day',
        weekdayMon: 'Mon',
        weekdayWed: 'Wed',
        weekdayFri: 'Fri',
        prevDay: 'Previous day',
        nextDay: 'Next day',
        latestDay: 'Latest day',
      },
    };

    const css = `
.ts-page { display: flex; flex-direction: column; gap: 16px; padding: 4px 4px 28px; color: var(--dsw-alias-label-primary); font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.ts-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 0 2px; }
.ts-title { font-size: 21px; font-weight: 600; letter-spacing: -0.015em; }
.ts-sub { font-size: 12.5px; color: var(--dsw-alias-label-secondary); margin-top: 5px; letter-spacing: -0.005em; }
.ts-toolbar { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ts-btn { height: 30px; padding: 0 13px; border-radius: 9px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font-size: 12.5px; font-family: inherit; cursor: pointer; transition: background 120ms ease, border-color 120ms ease; }
.ts-btn:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.ts-btn:active:not(:disabled) { transform: scale(0.98); }
.ts-btn:disabled { opacity: 0.4; cursor: default; }
.ts-icon-btn { width: 28px; height: 28px; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; line-height: 1; border-radius: 9px; }
.ts-card { border: 1px solid var(--dsw-alias-border-l1); border-radius: 16px; background: var(--dsw-alias-bg-layer-1); overflow: hidden; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06); }

/* Hero: four equal cells on one row; they never wrap into a lonely second row. */
.ts-hero { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.ts-hero-cell { padding: 16px 18px; min-width: 0; overflow: hidden; }
.ts-hero-cell + .ts-hero-cell { border-left: 1px solid var(--dsw-alias-border-l1); }
.ts-hero-label { font-size: 11.5px; color: var(--dsw-alias-label-secondary); letter-spacing: 0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ts-hero-value { font-size: 25px; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; margin-top: 6px; white-space: nowrap; }
.ts-hero-note { font-size: 11px; color: var(--dsw-alias-label-tertiary); margin-top: 6px; white-space: normal; line-height: 1.4; font-variant-numeric: tabular-nums; }
.ts-hero-delta { font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ts-bar { height: 6px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); margin-top: 10px; overflow: hidden; }
.ts-bar-fill { height: 100%; border-radius: 999px; background: var(--dsw-alias-brand-primary); transition: width 320ms cubic-bezier(0.25, 0.1, 0.25, 1); }
.ts-grade-line { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
.ts-grade-badge { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; letter-spacing: -0.02em; color: var(--dsw-alias-label-primary-inverted, #fff); }
.ts-grade-text { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }

/* Section headers keep the actions on the same line, so no vertical slack. */
.ts-section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; padding: 16px 20px 6px; flex-wrap: wrap; }
.ts-section-title { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.ts-section-hint { font-size: 11.5px; color: var(--dsw-alias-label-secondary); margin-top: 4px; }
.ts-legend { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ts-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.ts-legend-swatch { width: 12px; height: 12px; border-radius: 4px; flex: none; }

.ts-heat-body { padding: 6px 20px 14px; }
.ts-months { display: grid; gap: 4px; margin-left: 26px; height: 15px; font-size: 10px; color: var(--dsw-alias-label-tertiary); }
.ts-month { white-space: nowrap; }
.ts-heat { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 6px; align-items: start; }
.ts-weekdays { display: grid; grid-template-rows: repeat(7, minmax(0, 1fr)); gap: 4px; font-size: 10px; color: var(--dsw-alias-label-tertiary); align-items: center; }
.ts-grid { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 4px; }
.ts-col { display: grid; grid-template-rows: repeat(7, auto); gap: 4px; }
.ts-cell { width: 100%; aspect-ratio: 1 / 1; border-radius: 7px; border: 1px solid transparent; padding: 0; cursor: pointer; transition: transform 140ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 140ms ease, filter 140ms ease; will-change: transform; }
.ts-cell:hover:not(:disabled) { transform: translateY(-1px) scale(1.05); filter: brightness(1.08); z-index: 2; }
.ts-cell:active:not(:disabled) { transform: translateY(0) scale(0.97); }
.ts-cell:disabled { cursor: default; }
.ts-cell-selected { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
/* Matte nylon-blue: depth comes from restrained edges and shadows, without a gloss layer over every tile. */
.ts-heat { position: relative; }
/* Hover readout: replaces the unthemeable native title tooltip. JS places it
   below the hovered cell and moves it above / clamps it when an edge would clip
   it, so the CSS transform only centres it horizontally. */
.ts-heat-card { position: relative; }
.ts-tip { position: absolute; z-index: 5; width: 196px; padding: 9px 11px; border-radius: 9px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-2)); box-shadow: var(--dsw-shadow-lv2, 0 6px 18px rgba(0, 0, 0, 0.28)); pointer-events: none; transform: translateX(-50%); box-sizing: border-box; }
.ts-tip-head { font-size: 11px; color: var(--dsw-alias-label-secondary); }
.ts-tip-total { display: flex; align-items: baseline; gap: 5px; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin: 3px 0 7px; }
.ts-tip-total span { font-size: 10px; font-weight: 500; letter-spacing: 0; color: var(--dsw-alias-label-tertiary); }
.ts-tip-rows { display: grid; grid-template-columns: 1fr; gap: 3px; font-size: 11px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
.ts-tip-muted { font-size: 11px; color: var(--dsw-alias-label-tertiary); }

.ts-meta { padding: 10px 20px 14px; border-top: 1px solid var(--dsw-alias-border-l1); font-size: 10.5px; color: var(--dsw-alias-label-tertiary); line-height: 1.5; }

/* Day detail: header strip, metric strip, then full-width model + session rows. */
.ts-status { font-size: 10.5px; color: var(--dsw-alias-label-tertiary); max-width: 30ch; text-align: right; line-height: 1.4; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ts-status-error { color: var(--dsw-alias-state-error-primary); font-size: 11px; max-width: none; white-space: normal; }
.ts-muted { color: var(--dsw-alias-label-tertiary); font-size: 12.5px; padding: 14px 0; }
.ts-detail-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 20px 10px; flex-wrap: wrap; }
.ts-detail-title { display: flex; align-items: center; gap: 9px; }
.ts-detail-date { font-size: 17px; font-weight: 600; letter-spacing: -0.015em; font-variant-numeric: tabular-nums; }
.ts-detail-total { display: flex; align-items: baseline; gap: 7px; }
.ts-detail-total strong { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.ts-detail-total span { font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.ts-detail-retained { font-size: 10.5px; color: var(--dsw-alias-label-tertiary); margin-right: 6px; }
.ts-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); }
.ts-metric { padding: 12px 20px; min-width: 0; }
.ts-metric + .ts-metric { border-left: 1px solid var(--dsw-alias-border-l1); }
.ts-metric-label { font-size: 11.5px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.ts-metric-value { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; margin-top: 3px; }
.ts-metric-value-accent { color: var(--dsw-alias-state-success-primary); }
.ts-body { padding: 14px 20px 18px; }
.ts-subhead { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary); letter-spacing: -0.005em; margin-bottom: 9px; }

/* Composition: one stacked bar answers "where did the tokens go". */
.ts-comp { margin: 0 20px; padding: 12px 0 14px; }
.ts-comp-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.ts-comp-title { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
.ts-comp-total { font-size: 11.5px; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }
.ts-comp-bar { display: flex; height: 12px; border-radius: 6px; overflow: hidden; background: var(--dsw-alias-bg-layer-2); gap: 1px; }
.ts-comp-seg { height: 100%; }
.ts-comp-legend { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 9px; }
.ts-comp-item { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.ts-comp-dot { width: 9px; height: 9px; border-radius: 3px; flex: none; }
.ts-comp-item b { color: var(--dsw-alias-label-primary); font-weight: 600; font-variant-numeric: tabular-nums; }
.ts-comp-pct { color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }

/* Trend: compact column chart, no axes to misread. */
.ts-trend { padding: 0 20px 16px; }
.ts-trend-bars { display: grid; grid-template-columns: repeat(14, minmax(0, 1fr)); align-items: end; gap: 4px; height: 92px; }
.ts-trend-col { display: flex; flex-direction: column; justify-content: flex-end; height: 100%; cursor: default; }
.ts-trend-bar { border-radius: 4px 4px 2px 2px; background: var(--dsw-alias-bg-layer-2); min-height: 3px; transition: filter 120ms ease; }
.ts-trend-col:hover .ts-trend-bar { filter: brightness(1.25); }
.ts-trend-col-on .ts-trend-bar { background: var(--dsw-alias-brand-primary); }
.ts-trend-labels { display: grid; grid-template-columns: repeat(14, minmax(0, 1fr)); gap: 4px; margin-top: 6px; font-size: 9.5px; color: var(--dsw-alias-label-tertiary); text-align: center; font-variant-numeric: tabular-nums; }
.ts-trend-label-on { color: var(--dsw-alias-label-primary); font-weight: 600; }

/* Model rows: a bar per model is easier to rank than a chip row. */
.ts-models { margin-bottom: 18px; }
.ts-model-row { display: grid; grid-template-columns: minmax(0, 1fr) 96px 54px; align-items: center; gap: 12px; padding: 5px 0; }
.ts-model-name { font-size: 11.5px; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ts-model-track { height: 7px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; }
.ts-model-fill { height: 100%; border-radius: 999px; background: var(--dsw-alias-brand-primary); }
.ts-model-meta { text-align: right; font-size: 11.5px; font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-primary); }

.ts-table { display: flex; flex-direction: column; }
.ts-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(90px, 150px) 78px 68px; align-items: center; gap: 12px; padding: 8px 0; border-top: 1px solid var(--dsw-alias-border-l1); font-size: 12.5px; }
.ts-row:first-child { border-top: 0; }
.ts-row-head { color: var(--dsw-alias-label-tertiary); font-size: 10.5px; letter-spacing: 0.02em; padding-top: 0; padding-bottom: 6px; }
.ts-session-main { min-width: 0; }
.ts-session-title { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.005em; }
.ts-session-cwd { display: block; color: var(--dsw-alias-label-tertiary); font-size: 10.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.ts-session-model { font-size: 10.5px; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ts-num { text-align: right; font-variant-numeric: tabular-nums; }
.ts-num-muted { color: var(--dsw-alias-label-secondary); }
@media (max-width: 720px) {
  .ts-hero { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ts-hero-cell:nth-child(3) { border-left: 0; }
  .ts-hero-cell:nth-child(n + 3) { border-top: 1px solid var(--dsw-alias-border-l1); }
  .ts-row { grid-template-columns: minmax(0, 1fr) 64px 64px; }
  .ts-row-model { display: none; }
}
`;

    function apiUrl(routePath) {
      const relative = routePath.replace(/^\/+/, '');
      if (typeof document === 'undefined') return `/${relative}`;
      return new URL(relative, document.baseURI).pathname;
    }

    async function getJson(routePath) {
      const response = await fetch(apiUrl(routePath), { cache: 'no-store' });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body) throw new Error(body?.error ?? `HTTP ${response.status}`);
      if (body.ok !== true) throw new Error(body?.error ?? 'request-failed');
      return body;
    }

    /** 284.6K / 1.2M: compact numbers, one decimal under 100 units. */
    function fmtTokens(value) {
      const n = Number.isFinite(value) ? value : 0;
      if (n <= 0) return '0';
      if (n < 1000) return String(Math.round(n));
      if (n < 1000 * 1000) return `${trim(n / 1000)}K`;
      return `${trim(n / 1e6)}M`;
    }

    function trim(value) {
      const digits = Math.abs(value) >= 100 ? 0 : 1;
      return value.toFixed(digits).replace(/\.0$/, '');
    }

    function fmtInt(value) {
      return (Number.isFinite(value) ? Math.round(value) : 0).toLocaleString();
    }

    function fmtPercent(ratio) {
      const n = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
      return `${Math.round(n * 100)}%`;
    }

    /** Signed change against a previous value; `null` when there is no baseline. */
    function fmtDelta(current, previous) {
      if (!(previous > 0)) return null;
      const change = (current - previous) / previous;
      const sign = change > 0 ? '+' : '';
      return `${sign}${Math.round(change * 100)}%`;
    }

    /**
     * The four sources of a usage total, in the order they are stacked. Colors
     * come from the theme so the bar matches the surrounding panel.
     */
    const COMPOSITION = [
      { key: 'cacheRead', color: 'var(--dsw-alias-brand-primary)' },
      { key: 'input', color: '#4b93c8' },
      { key: 'output', color: '#6f8fb0' },
      { key: 'cacheWrite', color: '#3d7197' },
    ];

    function dateKey(date) {
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}`;
    }

    function parseKey(key) {
      const [y, m, d] = String(key).split('-').map((part) => Number.parseInt(part, 10));
      if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return undefined;
      return new Date(y, m - 1, d);
    }

    function keyLabel(key) {
      const date = parseKey(key);
      if (date === undefined) return String(key ?? '—');
      return `${date.getMonth() + 1}/${`${date.getDate()}`.padStart(2, '0')}`;
    }

    /** Clock time without seconds: the header timestamp stays quiet. */
    function fmtTime(value) {
      if (!Number.isFinite(value) || value <= 0) return '—';
      const date = new Date(value);
      return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
    }

    function emptyCounters() {
      return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, total: 0, calls: 0 };
    }

    function countersOf(source) {
      const base = emptyCounters();
      if (!source || typeof source !== 'object') return base;
      for (const key of Object.keys(base)) {
        const value = source[key];
        if (Number.isFinite(value) && value > 0) base[key] = value;
      }
      return base;
    }

    /**
     * Matte nylon blue: low saturation, a cool steel base, and a compact cobalt
     * ramp. The depth comes from contrast between the tile and its edge, never
     * from a glossy gradient or neon highlight.
     */
    const BLUE_RAMP = [
      { fill: '#323943', edge: 'rgba(194, 214, 232, 0.08)', shadow: 'rgba(0, 0, 0, 0.24)' },
      { fill: '#3c566f', edge: 'rgba(164, 210, 239, 0.16)', shadow: 'rgba(0, 28, 56, 0.30)' },
      { fill: '#3d7197', edge: 'rgba(162, 222, 246, 0.23)', shadow: 'rgba(0, 30, 68, 0.36)' },
      { fill: '#3c82b8', edge: 'rgba(177, 228, 246, 0.28)', shadow: 'rgba(0, 32, 84, 0.42)' },
      { fill: '#4b93c8', edge: 'rgba(201, 238, 250, 0.34)', shadow: 'rgba(0, 38, 94, 0.46)' },
    ];

    function cellPaint(level) {
      return BLUE_RAMP[Math.max(0, Math.min(BLUE_RAMP.length - 1, level | 0))];
    }

    function cellStyle(level) {
      if (level <= 0) {
        return { background: '#252a31', borderColor: 'rgba(185, 205, 224, 0.09)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.035), inset 0 -1px 0 rgba(0, 0, 0, 0.28)' };
      }
      const step = cellPaint(level);
      return {
        background: step.fill,
        borderColor: step.edge,
        boxShadow: `inset 0 1px 0 ${step.edge}, inset 0 -1px 0 rgba(0, 0, 0, 0.25), 0 1px 3px ${step.shadow}`,
      };
    }

    function gradeTone(grade) {
      if (grade === 'A' || grade === 'B') return 'var(--dsw-alias-state-success-primary)';
      if (grade === 'C') return 'var(--dsw-alias-state-warn-primary)';
      return 'var(--dsw-alias-state-error-primary)';
    }

    /** Peak-relative intensity: 0 empty, 1..3 quartiles of the busiest day, 4 the peak. */
    function intensity(total, peak) {
      if (!(total > 0) || !(peak > 0)) return 0;
      const ratio = total / peak;
      if (ratio >= 0.85) return 4;
      if (ratio >= 0.5) return 3;
      if (ratio >= 0.2) return 2;
      return 1;
    }

    /**
     * Calendar heatmap: columns are weeks, rows are weekdays (Mon → Sun). A
     * fixed week count plus CSS `1fr` columns means the grid fills whatever the
     * settings panel gives it, with no measured width to fall out of date while
     * the modal animates open. The last column is the current week, whose future
     * cells render as placeholders.
     */
    const HEATMAP_WEEKS = 16;

    /** The calendar window the heatmap draws: first cell through today. */
    function heatWindow(days) {
      const byDate = new Map();
      for (const day of days) {
        if (typeof day?.date === 'string') byDate.set(day.date, day);
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastMonday = new Date(today);
      lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const firstMonday = new Date(lastMonday);
      firstMonday.setDate(lastMonday.getDate() - (HEATMAP_WEEKS - 1) * 7);
      return { byDate, today, firstMonday };
    }

    function buildGrid(window) {
      const { byDate, today, firstMonday } = window;
      const weeks = HEATMAP_WEEKS;

      const columns = [];
      const months = [];
      for (let w = 0; w < weeks; w += 1) {
        const monday = new Date(firstMonday);
        monday.setDate(firstMonday.getDate() + w * 7);
        if (w === 0 || monday.getDate() <= 7) {
          months.push({ index: w, label: `${monday.getMonth() + 1}月` });
        }
        const cells = [];
        for (let d = 0; d < 7; d += 1) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + d);
          const key = dateKey(date);
          const future = date.getTime() > today.getTime();
          cells.push({
            key,
            future,
            label: `${date.getMonth() + 1}/${`${date.getDate()}`.padStart(2, '0')}`,
            day: future ? undefined : byDate.get(key),
          });
        }
        columns.push(cells);
      }
      return { columns, months, weeks };
    }

    /**
     * The settings shell picks nav glyphs from a closed list of section ids and
     * falls back to its gear for any third-party section. Claim the nav row
     * whose visible text equals this plugin's own label and swap that fallback
     * gear for the wallet mark, so the row reads as its own item rather than a
     * duplicate of "General". Re-read on every sync so a locale switch keeps
     * label and glyph consistent.
     */
    const NAV_ICON_MARKER = 'data-dsh-token-spend-nav-icon';
    const NAV_ROW_SELECTOR = '[role="dialog"] nav button';

    function navIconSvg() {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="#000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M2.1 4.6c0-.9.7-1.6 1.6-1.6h8.6c.9 0 1.6.7 1.6 1.6v1H2.1z"/>'
        + '<path d="M2.1 4.6v6.8c0 .9.7 1.6 1.6 1.6h8.6c.9 0 1.6-.7 1.6-1.6V6.9"/>'
        + '<path d="M13.9 6.9h-2.6c-.8 0-1.4.6-1.4 1.3s.6 1.3 1.4 1.3h2.6z"/>'
        + '</svg>';
    }

    function navIconCss(maskUrl) {
      return [
        `[${NAV_ICON_MARKER}] > svg { display: none; }`,
        `[${NAV_ICON_MARKER}]::before {`,
        "  content: '';",
        '  flex: none;',
        '  width: 16px;',
        '  height: 16px;',
        '  background-color: currentColor;',
        `  -webkit-mask-image: url("${maskUrl}");`,
        `  mask-image: url("${maskUrl}");`,
        '  -webkit-mask-repeat: no-repeat;',
        '  mask-repeat: no-repeat;',
        '  -webkit-mask-position: center;',
        '  mask-position: center;',
        '  -webkit-mask-size: 16px 16px;',
        '}',
      ].join('\n');
    }

    function installNavIcon(ctx, resolveLabel) {
      if (typeof document === 'undefined') return;
      ctx.effect(() => {
        const tag = document.createElement('style');
        tag.dataset.plugin = PLUGIN_ID;
        tag.dataset.pluginCss = 'dsh-token-spend/nav-icon';
        tag.textContent = navIconCss(`data:image/svg+xml,${encodeURIComponent(navIconSvg())}`);
        document.head.appendChild(tag);
        let disposed = false;
        let scheduled = false;
        const sync = () => {
          scheduled = false;
          if (disposed) return;
          const wanted = String(resolveLabel() ?? '').trim();
          for (const row of document.querySelectorAll(NAV_ROW_SELECTOR)) {
            const own = wanted.length > 0 && String(row.textContent ?? '').trim() === wanted;
            if (own) row.setAttribute(NAV_ICON_MARKER, '');
            else row.removeAttribute(NAV_ICON_MARKER);
          }
        };
        const schedule = () => {
          if (scheduled || disposed) return;
          scheduled = true;
          queueMicrotask(sync);
        };
        sync();
        const observer = new MutationObserver(schedule);
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        return () => {
          disposed = true;
          observer.disconnect();
          for (const row of document.querySelectorAll(`[${NAV_ICON_MARKER}]`)) row.removeAttribute(NAV_ICON_MARKER);
          tag.remove();
        };
      }, 'dsh-token-spend: settings nav icon');
    }

    function metricCell(label, value, accent) {
      return h(
        'div',
        { key: label, className: 'ts-metric' },
        h('div', { className: 'ts-metric-label' }, label),
        h('div', { className: `ts-metric-value${accent ? ' ts-metric-value-accent' : ''}` }, value),
      );
    }

    function TokenSpendPage({ t }) {
      const [data, setData] = React.useState(null);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState(null);
      const [selected, setSelected] = React.useState(null);
      const [hover, setHover] = React.useState(null);
      const cardRef = React.useRef(null);

      const load = React.useCallback(async (force) => {
        setLoading(true);
        setError(null);
        try {
          const body = await getJson(`/token-spend/summary${force ? '?refresh=1' : ''}`);
          setData(body);
          setSelected((prev) => {
            const list = Array.isArray(body.days) ? body.days : [];
            if (prev !== null && list.some((day) => day.date === prev)) return prev;
            const used = list.filter((day) => countersOf(day).total > 0);
            if (used.length > 0) return used[used.length - 1].date;
            return list.length > 0 ? list[list.length - 1].date : null;
          });
        } catch (failure) {
          setError(String(failure?.message ?? failure));
        } finally {
          setLoading(false);
        }
      }, []);

      React.useEffect(() => {
        load(false);
      }, [load]);

      const days = React.useMemo(() => (Array.isArray(data?.days) ? data.days : []), [data]);
      const totals = React.useMemo(() => countersOf(data?.totals), [data]);

      // Provenance line for the data card: which logs fed it and what was merged.
      const retainedDecor = data?.retainedDeleted && data.retainedDeleted.sessions > 0
        ? t('retained')
          .replace('{n}', fmtInt(data.retainedDeleted.sessions))
          .replace('{tokens}', fmtTokens(data.retainedDeleted.total))
        : '';
      const sourceNote = data === null
        ? ''
        : [
            t('sessions').replace('{n}', String(data.sessionCount ?? 0)),
            data.skipped > 0 ? t('skipped').replace('{n}', String(data.skipped)) : '',
            data.duplicates > 0 ? t('merged').replace('{n}', fmtInt(data.duplicates)) : '',
            retainedDecor,
          ].filter((part) => part.length > 0).join(' · ');
      const statusText = data === null
        ? null
        : t('lastUpdated').replace('{time}', fmtTime(data.generatedAt));

      const budget = data?.budget && typeof data.budget === 'object' ? data.budget : { tokens: 0, source: 'auto' };
      const budgetTokens = Number.isFinite(budget.tokens) ? budget.tokens : 0;
      const todayBlock = data?.today && typeof data.today === 'object'
        ? { total: Number(data.today.total) || 0, previous: Number(data.today.previous) || 0, calls: Number(data.today.calls) || 0 }
        : { total: 0, previous: 0, calls: 0 };
      const todayDelta = fmtDelta(todayBlock.total, todayBlock.previous);
      // The budget is a day budget, so the bar tracks today rather than all time.
      const budgetRatio = budgetTokens > 0 ? Math.min(1, todayBlock.total / budgetTokens) : 0;
      const cacheHitRate = Number.isFinite(data?.cacheHitRate) ? data.cacheHitRate : 0;
      const grade = cacheHitRate >= 0.7 ? 'A' : cacheHitRate >= 0.5 ? 'B' : cacheHitRate >= 0.3 ? 'C' : 'D';

      const peak = React.useMemo(() => {
        let max = 0;
        for (const day of days) {
          const value = countersOf(day).total;
          if (value > max) max = value;
        }
        return max;
      }, [days]);

      const window = React.useMemo(() => heatWindow(days), [days]);
      const grid = React.useMemo(() => buildGrid(window), [window]);

      const dayMap = React.useMemo(() => {
        const map = new Map();
        for (const day of days) {
          if (typeof day?.date === 'string') map.set(day.date, countersOf(day));
        }
        return map;
      }, [days]);

      // "7-day average" is a calendar average: quiet days count as zero, so a
      // week with two busy days is not reported as a busy week.
      const avg7 = React.useMemo(() => {
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        let sum = 0;
        for (let offset = 0; offset < 7; offset += 1) {
          const date = new Date(end);
          date.setDate(end.getDate() - offset);
          sum += (dayMap.get(dateKey(date)) ?? emptyCounters()).total;
        }
        return sum / 7;
      }, [dayMap]);

      const peakDay = React.useMemo(() => {
        let best = null;
        for (const day of days) {
          if (best === null || countersOf(day).total > countersOf(best).total) best = day;
        }
        return best;
      }, [days]);

      const selectedIndex = selected === null ? -1 : days.findIndex((day) => day.date === selected);
      const selectedDay = selectedIndex >= 0 ? days[selectedIndex] : undefined;
      const selectedCounters = React.useMemo(
        () => (selected === null ? emptyCounters() : (dayMap.get(selected) ?? emptyCounters())),
        [dayMap, selected],
      );

      /** Where the selected day's tokens went, largest slice first. */
      const composition = React.useMemo(() => {
        const labels = {
          cacheRead: t('cacheRead'),
          input: t('inputTokens'),
          output: t('outputTokens'),
          cacheWrite: t('cacheWrite'),
        };
        const total = selectedCounters.total;
        return COMPOSITION
          .map((entry) => ({
            key: entry.key,
            color: entry.color,
            label: labels[entry.key],
            value: selectedCounters[entry.key] ?? 0,
            share: total > 0 ? (selectedCounters[entry.key] ?? 0) / total : 0,
          }))
          .filter((entry) => entry.value > 0);
      }, [selectedCounters, t]);

      /** The last 14 calendar days, empty days included, ending today. */
      const trend = React.useMemo(() => {
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        const list = [];
        for (let offset = 13; offset >= 0; offset -= 1) {
          const date = new Date(end);
          date.setDate(end.getDate() - offset);
          const key = dateKey(date);
          list.push({ key, label: keyLabel(key), total: (dayMap.get(key) ?? emptyCounters()).total });
        }
        return list;
      }, [dayMap]);

      const trendPeak = React.useMemo(() => {
        let max = 0;
        for (const entry of trend) if (entry.total > max) max = entry.total;
        return max;
      }, [trend]);

      const selectedSessions = React.useMemo(() => {
        if (selected === null) return [];
        const list = Array.isArray(data?.sessions) ? data.sessions : [];
        const rows = [];
        for (const session of list) {
          const bucket = session?.days && typeof session.days === 'object' ? session.days[selected] : undefined;
          const counters = countersOf(bucket);
          if (counters.total <= 0) continue;
          const models = Array.isArray(bucket?.models) ? bucket.models : [];
          const topModel = models.length > 0 && typeof models[0].model === 'string' ? models[0].model : '';
          rows.push({ session, counters, model: topModel });
        }
        rows.sort((a, b) => b.counters.total - a.counters.total);
        return rows;
      }, [data, selected]);

      const modelRows = React.useMemo(() => {
        const source = selectedDay?.models;
        if (!Array.isArray(source)) return [];
        return source
          .map((entry) => ({
            model: typeof entry?.model === 'string' && entry.model.length > 0 ? entry.model : 'unknown',
            ...countersOf(entry),
          }))
          .filter((entry) => entry.total > 0)
          .sort((a, b) => b.total - a.total);
      }, [selectedDay]);

      // Day stepping follows the calendar shown by the heatmap, not the sparse
      // list of days that happen to have usage: with a single recorded day the
      // arrows were both disabled and looked broken.
      const bounds = React.useMemo(
        () => ({ start: window.firstMonday.getTime(), end: window.today.getTime() }),
        [window],
      );

      const shiftDay = (key, delta) => {
        const parsed = parseKey(key);
        if (parsed === undefined) return key;
        const next = new Date(parsed);
        next.setDate(parsed.getDate() + delta);
        const time = next.getTime();
        if (time < bounds.start || time > bounds.end) return key;
        return dateKey(next);
      };

      const canPrev = selected !== null && shiftDay(selected, -1) !== selected;
      const canNext = selected !== null && shiftDay(selected, 1) !== selected;

      /** The newest day that actually recorded usage, for the "latest" shortcut. */
      const latestUsedKey = React.useMemo(() => {
        for (let index = days.length - 1; index >= 0; index -= 1) {
          if (countersOf(days[index]).total > 0) return days[index].date;
        }
        return days.length > 0 ? days[days.length - 1].date : null;
      }, [days]);

      const moveDay = (delta) => {
        if (selected === null) return;
        const next = shiftDay(selected, delta);
        if (next !== selected) setSelected(next);
      };

      /**
       * Anchor the hover card next to the cell and keep it inside the card on all
       * four sides:
       *  - horizontal: the readout is centred on the cell, so its centre is
       *    clamped by half its width (edge cells would otherwise spill out);
       *  - vertical: preferred below the cell, moved above when the bottom would
       *    overflow, and clamped into the card when neither side has full room.
       */
      const TIP_WIDTH = 196;
      const TIP_HEIGHT = 108;
      const TIP_GAP = 6;
      const TIP_MARGIN = 6;

      const showHover = (cellState, element) => {
        if (cellState.future) return;
        const hostBox = cardRef.current?.getBoundingClientRect?.();
        const box = element?.getBoundingClientRect?.();
        if (hostBox === undefined || box === undefined) {
          setHover({ label: cellState.label, counters: countersOf(cellState.day), anchor: null });
          return;
        }
        const half = TIP_WIDTH / 2;
        const naturalX = box.left - hostBox.left + box.width / 2;
        const x = Math.min(
          Math.max(naturalX, half + TIP_MARGIN),
          Math.max(half + TIP_MARGIN, hostBox.width - half - TIP_MARGIN),
        );

        const below = box.bottom - hostBox.top + TIP_GAP;
        const above = box.top - hostBox.top - TIP_HEIGHT - TIP_GAP;
        let y;
        if (below + TIP_HEIGHT + TIP_MARGIN <= hostBox.height) y = below;
        else if (above >= TIP_MARGIN) y = above;
        else {
          const lowest = Math.max(TIP_MARGIN, hostBox.height - TIP_HEIGHT - TIP_MARGIN);
          y = Math.min(Math.max(below, TIP_MARGIN), lowest);
        }

        setHover({ label: cellState.label, counters: countersOf(cellState.day), anchor: { x, y } });
      };

      const heatCell = (cellState) => {
        const counters = cellState.day === undefined ? undefined : countersOf(cellState.day);
        const total = counters?.total ?? 0;
        const level = cellState.future ? 0 : intensity(total, peak);
        const className = `ts-cell${cellState.key === selected ? ' ts-cell-selected' : ''}`;
        // The browser's native `title` tooltip cannot be themed, so the cell
        // carries no title: hovering reports into the card's own tooltip.
        return h('button', {
          key: cellState.key,
          type: 'button',
          className,
          style: cellState.future ? { opacity: 0.35 } : cellStyle(level),
          disabled: cellState.future,
          'aria-label': `${cellState.key} · ${fmtTokens(total)} tokens`,
          onMouseEnter: cellState.future ? undefined : (event) => showHover(cellState, event.currentTarget),
          onMouseLeave: cellState.future ? undefined : () => setHover(null),
          onFocus: cellState.future ? undefined : (event) => showHover(cellState, event.currentTarget),
          onBlur: cellState.future ? undefined : () => setHover(null),
          onClick: () => {
            if (!cellState.future) setSelected(cellState.key);
          },
        });
      };

      const heatmap = h(
        'div',
        { className: 'ts-card ts-heat-card', ref: cardRef, onMouseLeave: () => setHover(null) },
        h(
          'div',
          { className: 'ts-section-head' },
          h(
            'div',
            null,
            h('div', { className: 'ts-section-title' }, t('heatmap')),
            h('div', { className: 'ts-section-hint' }, t('heatmapHint')),
          ),
          h(
            'div',
            { className: 'ts-legend' },
            ...[
              { label: t('legendLow'), level: 1 },
              { label: t('legendMid'), level: 2 },
              { label: t('legendHigh'), level: 3 },
              { label: t('legendPeak'), level: 4 },
            ].map((entry) => h(
              'div',
              { key: entry.label, className: 'ts-legend-item' },
              h('span', { className: 'ts-legend-swatch', style: cellStyle(entry.level) }),
              h('span', {}, entry.label),
            )),
          ),
        ),
        hover === null
          ? null
          : h(
              'div',
              {
                className: 'ts-tip',
                role: 'tooltip',
                style: hover.anchor === null || hover.anchor === undefined
                  ? undefined
                  : { left: `${hover.anchor.x}px`, top: `${hover.anchor.y}px` },
              },
              h('div', { className: 'ts-tip-head' }, hover.label),
              h('div', { className: 'ts-tip-total' }, fmtTokens(hover.counters.total), h('span', {}, t('tokens'))),
              hover.counters.total > 0
                ? h(
                    'div',
                    { className: 'ts-tip-rows' },
                    h('span', {}, `${t('inputTokens')} ${fmtTokens(hover.counters.input)}`),
                    h('span', {}, `${t('outputTokens')} ${fmtTokens(hover.counters.output)}`),
                    h('span', {}, `${t('cacheRead')} ${fmtTokens(hover.counters.cacheRead)}`),
                    h('span', {}, `${t('calls')} ${fmtInt(hover.counters.calls)}`),
                  )
                : h('div', { className: 'ts-tip-muted' }, t('noUsageThatDay')),
            ),
        h(
          'div',
          { className: 'ts-heat-body' },
          h(
            'div',
            { className: 'ts-months', style: { gridTemplateColumns: `repeat(${grid.weeks}, minmax(0, 1fr))` } },
            ...grid.columns.map((column, index) => {
              const month = grid.months.find((entry) => entry.index === index);
              return h('span', { key: `m${index}`, className: 'ts-month' }, month ? month.label : '');
            }),
          ),
          h(
            'div',
            { className: 'ts-heat' },
            h(
              'div',
              { className: 'ts-weekdays' },
              ...Array.from({ length: 7 }, (_, index) => h(
                'span',
                { key: `w${index}` },
                index === 0 ? t('weekdayMon') : index === 2 ? t('weekdayWed') : index === 4 ? t('weekdayFri') : '',
              )),
            ),
            h(
              'div',
              { className: 'ts-grid' },
              ...grid.columns.map((column, index) => h(
                'div',
                { key: `c${index}`, className: 'ts-col' },
                ...column.map(heatCell),
              )),
            ),
          ),
        ),
        h(
          'div',
          { className: 'ts-meta' },
          sourceNote.length > 0 ? sourceNote : null,
        ),
      );

      const detailHead = h(
        'div',
        { className: 'ts-detail-head' },
        h(
          'div',
          { className: 'ts-detail-title' },
          h('span', { className: 'ts-detail-date' }, selected === null ? t('noSelection') : keyLabel(selected)),
          h(
            'button',
            { type: 'button', className: 'ts-btn ts-icon-btn', title: t('prevDay'), 'aria-label': t('prevDay'), disabled: !canPrev, onClick: () => moveDay(-1) },
            '‹',
          ),
          h(
            'button',
            { type: 'button', className: 'ts-btn ts-icon-btn', title: t('nextDay'), 'aria-label': t('nextDay'), disabled: !canNext, onClick: () => moveDay(1) },
            '›',
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'ts-btn',
              disabled: latestUsedKey === null,
              onClick: () => {
                if (latestUsedKey !== null) setSelected(latestUsedKey);
              },
            },
            t('latestDay'),
          ),
        ),
        h(
          'div',
          { className: 'ts-detail-total' },
          selectedDay?.deletedSessions > 0
            ? h(
                'span',
                { className: 'ts-detail-retained', title: t('dayRetained').replace('{n}', '') },
                t('dayRetained')
                  .replace('{n}', fmtInt(selectedDay.deletedSessions))
                  .replace('{tokens}', fmtTokens(selectedDay.deletedTotal ?? 0)),
              )
            : null,
          h('strong', {}, fmtTokens(selectedCounters.total)),
          h('span', {}, t('tokens')),
        ),
      );

      const metrics = h(
        'div',
        { className: 'ts-metrics' },
        metricCell(t('inputTokens'), fmtTokens(selectedCounters.input)),
        metricCell(t('outputTokens'), fmtTokens(selectedCounters.output)),
        metricCell(t('cacheRead'), fmtTokens(selectedCounters.cacheRead)),
        metricCell(t('cacheWrite'), fmtTokens(selectedCounters.cacheWrite)),
        selectedCounters.reasoning > 0 ? metricCell(t('reasoning'), fmtTokens(selectedCounters.reasoning)) : null,
        metricCell(t('calls'), fmtInt(selectedCounters.calls)),
        metricCell(
          t('cacheHit'),
          fmtPercent(
            selectedCounters.cacheRead + selectedCounters.input + selectedCounters.cacheWrite > 0
              ? selectedCounters.cacheRead / (selectedCounters.cacheRead + selectedCounters.input + selectedCounters.cacheWrite)
              : 0,
          ),
          true,
        ),
      );

      const models = modelRows.length === 0
        ? null
        : h(
            'div',
            { className: 'ts-models' },
            h('div', { className: 'ts-subhead' }, t('models')),
            ...modelRows.slice(0, 8).map((entry) => {
              const name = typeof entry.model === 'string' && entry.model.length > 0 ? entry.model : 'unknown';
              const share = selectedCounters.total > 0 ? entry.total / selectedCounters.total : 0;
              return h(
                'div',
                { key: name, className: 'ts-model-row' },
                h('span', { className: 'ts-model-name', title: name }, name),
                h('div', { className: 'ts-model-track' }, h('div', { className: 'ts-model-fill', style: { width: `${Math.max(1, share * 100)}%` } })),
                h('span', { className: 'ts-model-meta' }, `${fmtTokens(entry.total)} · ${fmtPercent(share)}`),
              );
            }),
          );

      const sessions = h(
        'div',
        null,
        h('div', { className: 'ts-subhead' }, `${t('daySessions')} · ${selectedSessions.length}`),
        selectedSessions.length === 0
          ? h('div', { className: 'ts-muted' }, t('noUsageThatDay'))
          : h(
              'div',
              { className: 'ts-table' },
              h(
                'div',
                { className: 'ts-row ts-row-head' },
                h('span', {}, t('session')),
                h('span', { className: 'ts-row-model' }, t('model')),
                h('span', { className: 'ts-num' }, t('dayTotal')),
                h('span', { className: 'ts-num' }, t('share')),
              ),
              ...selectedSessions.map(({ session, counters, model }) => {
                const share = selectedCounters.total > 0 ? counters.total / selectedCounters.total : 0;
                return h(
                  'div',
                  { key: String(session.id), className: 'ts-row' },
                  h(
                    'div',
                    { className: 'ts-session-main' },
                    h(
                      'span',
                      { className: 'ts-session-title', title: session.title ?? String(session.id) },
                      session.title === null || session.title === undefined ? String(session.id) : session.title,
                    ),
                    h('span', { className: 'ts-session-cwd', title: session.cwd ?? undefined }, session.cwd ?? '—'),
                  ),
                  h('span', { className: 'ts-session-model ts-row-model', title: model }, model.length > 0 ? model : '—'),
                  h('span', { className: 'ts-num' }, fmtTokens(counters.total)),
                  h('span', { className: 'ts-num ts-num-muted' }, fmtPercent(share)),
                );
              }),
            ),
      );

      const compositionBlock = composition.length === 0
        ? null
        : h(
            'div',
            { className: 'ts-comp' },
            h(
              'div',
              { className: 'ts-comp-head' },
              h('span', { className: 'ts-comp-title' }, t('composition')),
              h('span', { className: 'ts-comp-total' }, `${fmtTokens(selectedCounters.total)} ${t('tokens')}`),
            ),
            h(
              'div',
              { className: 'ts-comp-bar' },
              ...composition.map((entry) => h('div', {
                key: entry.key,
                className: 'ts-comp-seg',
                style: { width: `${Math.max(0.5, entry.share * 100)}%`, backgroundColor: entry.color },
              })),
            ),
            h(
              'div',
              { className: 'ts-comp-legend' },
              ...composition.map((entry) => h(
                'span',
                { key: entry.key, className: 'ts-comp-item' },
                h('span', { className: 'ts-comp-dot', style: { backgroundColor: entry.color } }),
                h('span', {}, entry.label),
                h('b', {}, fmtTokens(entry.value)),
                h('span', { className: 'ts-comp-pct' }, fmtPercent(entry.share)),
              )),
            ),
          );

      const detail = h(
        'div',
        { className: 'ts-card' },
        detailHead,
        metrics,
        compositionBlock,
        h('div', { className: 'ts-body' }, selectedCounters.total <= 0 ? h('div', { className: 'ts-muted' }, t('noUsageThatDay')) : models, sessions),
      );

      const trendCard = h(
        'div',
        { className: 'ts-card' },
        h(
          'div',
          { className: 'ts-section-head' },
          h(
            'div',
            null,
            h('div', { className: 'ts-section-title' }, t('trend')),
            h('div', { className: 'ts-section-hint' }, t('totalAllInHint')),
          ),
        ),
        h(
          'div',
          { className: 'ts-trend' },
          h(
            'div',
            { className: 'ts-trend-bars' },
            ...trend.map((entry) => {
              const ratio = trendPeak > 0 ? entry.total / trendPeak : 0;
              return h(
                'div',
                {
                  key: entry.key,
                  className: `ts-trend-col${entry.key === selected ? ' ts-trend-col-on' : ''}`,
                  title: `${entry.label} · ${fmtTokens(entry.total)}`,
                },
                h('div', {
                  className: 'ts-trend-bar',
                  style: {
                    height: `${Math.max(2, ratio * 100)}%`,
                    backgroundColor: entry.key === selected ? undefined : 'var(--dsw-alias-brand-primary)',
                    opacity: entry.key === selected ? undefined : (0.32 + ratio * 0.5),
                  },
                }),
              );
            }),
          ),
          h(
            'div',
            { className: 'ts-trend-labels' },
            ...trend.map((entry) => h(
              'span',
              { key: entry.key, className: entry.key === selected ? 'ts-trend-label-on' : '' },
              entry.label,
            )),
          ),
        ),
      );

      const hero = h(
        'div',
        { className: 'ts-card ts-hero' },
        h(
          'div',
          { className: 'ts-hero-cell' },
          h('div', { className: 'ts-hero-label' }, t('totalAllIn')),
          h('div', { className: 'ts-hero-value' }, fmtTokens(totals.total)),
          // One short fact per card: the full split lives in the cell tooltip so
          // a narrow column never truncates the line.
          h(
            'div',
            {
              className: 'ts-hero-note',
              title: `${t('inputTokens')} ${fmtTokens(totals.input)} · ${t('outputTokens')} ${fmtTokens(totals.output)} · ${t('cacheRead')} ${fmtTokens(totals.cacheRead)}`,
            },
            `${t('inputTokens')} ${fmtTokens(totals.input)}`,
          ),
        ),
        h(
          'div',
          { className: 'ts-hero-cell' },
          h('div', { className: 'ts-hero-label' }, t('today')),
          h('div', { className: 'ts-hero-value' }, fmtTokens(todayBlock.total)),
          h('div', { className: 'ts-bar' }, h('div', { className: 'ts-bar-fill', style: { width: `${Math.round(budgetRatio * 100)}%` } })),
          h(
            'div',
            {
              className: 'ts-hero-note',
              title: budgetTokens > 0 ? `${t('budget')} ${fmtTokens(budgetTokens)} · ${fmtPercent(budgetRatio)}` : undefined,
            },
            h(
              'span',
              {
                className: 'ts-hero-delta',
                style: {
                  color: todayDelta === null
                    ? 'var(--dsw-alias-label-tertiary)'
                    : (todayDelta.startsWith('-') ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-state-warn-primary)'),
                },
              },
              todayDelta === null ? t('yesterdayNone') : `${t('vsYesterday')} ${todayDelta}`,
            ),
          ),
        ),
        h(
          'div',
          { className: 'ts-hero-cell' },
          h('div', { className: 'ts-hero-label' }, t('cacheHit')),
          h(
            'div',
            { className: 'ts-grade-line' },
            h('div', { className: 'ts-grade-badge', style: { backgroundColor: gradeTone(grade) } }, grade),
            h('div', { className: 'ts-grade-text' }, fmtPercent(cacheHitRate)),
          ),
          h('div', { className: 'ts-hero-note' }, `${t('cacheRead')} ${fmtTokens(totals.cacheRead)}`),
        ),
        h(
          'div',
          { className: 'ts-hero-cell' },
          h('div', { className: 'ts-hero-label' }, t('avg7')),
          h('div', { className: 'ts-hero-value' }, fmtTokens(avg7)),
          h(
            'div',
            {
              className: 'ts-hero-note',
              title: peakDay ? `${t('peakDay')} ${keyLabel(peakDay.date)} · ${fmtTokens(countersOf(peakDay).total)}` : undefined,
            },
            peakDay ? `${t('peakDay')} ${keyLabel(peakDay.date)}` : '—',
          ),
        ),
      );

      const body = data === null
        ? (error === null ? h('div', { className: 'ts-muted' }, t('loading')) : null)
        : totals.total <= 0
          ? h('div', { className: 'ts-card' }, h('div', { className: 'ts-muted', style: { padding: '20px 16px' } }, t('empty')))
          : h(React.Fragment, null, hero, heatmap, trendCard, detail);

      return h(
        'div',
        { className: 'ts-page' },
        h(
          'div',
          { className: 'ts-head' },
          h(
            'div',
            null,
            h('div', { className: 'ts-title' }, t('title')),
            h('div', { className: 'ts-sub' }, t('subtitle')),
          ),
          h(
            'div',
            { className: 'ts-toolbar' },
            loading ? h('span', { className: 'ts-status' }, t('loading')) : statusText !== null ? h('span', { className: 'ts-status' }, statusText) : null,
            h(
              'button',
              { type: 'button', className: 'ts-btn', disabled: loading, onClick: () => load(true) },
              t('refresh'),
            ),
          ),
        ),
        error !== null ? h('div', { className: 'ts-status ts-status-error' }, `${t('loadFailed')}${error}`) : null,
        body,
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, dicts), 'dsh-token-spend: dictionaries');
        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.plugin = PLUGIN_ID;
          style.dataset.pluginCss = 'dsh-token-spend/main';
          style.textContent = css;
          document.head.appendChild(style);
          return () => style.remove();
        }, 'dsh-token-spend: styles');
        const t = ctx.locale.bind(NS);
        installNavIcon(ctx, () => t('nav'));
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'token-spend',
          order: 55,
          label: () => t('nav'),
          locale: NS,
          inject: () => ({ t }),
        }, () => h(TokenSpendPage, { t })));
      },
    };
  },
});
