# 花费 · @local/dsh-token-spend

**每一笔 token 都算清楚。** 在设置里加一页「花费」：直接读本机已提交的会话日志，把每日全部用量做成热力图、构成图、14 天趋势和当天明细——**不联网、不读账单、不另建数据库**。

## 它做什么

- **全部用量**：输入 + 缓存读取 + 缓存写入 + 输出（等于服务商的 `totalTokens`，不是只看 input+output）。
- **今日 / 昨日**：顶部给出今日用量与环比。
- **用量构成**：四类 token 的占比条。
- **14 天趋势 + 每日热力图**：按本地日历日分桶，点色块看当天明细。
- **当天明细**：当天每个会话、每个模型各花了多少，以及缓存命中率。
- **预算条**：日预算。没配 `budgetTokens` 时按历史最忙一天 ×1.25 取整推出来，只作参照。
- **已删除会话仍计入**：删掉会话不会让历史花费凭空缩水，页面会单列这部分占比。

## 两条计数规则

1. **一次调用只记一次。** seed / fork / 子智能体会把继承的事件前缀复制进自己的日志，同一个 `message.id` 可能出现在多个文件里；用量按该 id 计数一次。
2. **缓存读不算输入。** 服务商的 `inputTokens` 不含缓存读取，而缓存读在真实日志里约为新鲜输入的 16 倍；只用 input+output 会把用量低估约 94%。

折叠结果按会话的 `snapshot.revision` 缓存，刷新时只重读真正变过的日志。

## 已删除会话的账本

永久删除会整目录删掉会话日志，纯日志派生的总量会「改写历史」。所以插件把见过的用量按天、按会话、按模型记在：

```
<DSH_HOME>/storages/token-spend/ledger.json
```

**只有计数器**——没有标题、没有路径、没有消息内容。写入是「临时文件 + rename」的原子替换，写坏了也不会抹掉已记录的量。`retainDeleted: false` 可关掉保留。

## 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/token-spend/summary` | 聚合结果；`?refresh=1` 跳过 30 秒缓存 |

返回 `totals` / `days` / `sessions` / `models` / `today` / `budget` / `cacheHitRate` / `retainedDeleted`。

## 文件

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半：注册 `/token-spend/summary`，折叠会话日志、维护日账本。 |
| `client.js` | Web 半：设置页、样式、侧栏图标。 |
| `cordis.patch.yml` | 插入 `token-spend` Loader 行。 |
| `locale/en.json`、`locale/zh.json` | 插件管理器和设置页显示的元数据。 |
| `icon.svg` | 原始线条图标。 |

## 配置

| 键 | 默认 | 说明 |
|---|---|---|
| `budgetTokens` | `0` | 日预算；`0` 表示按峰值自动推 |
| `cacheTtlMs` | `30000` | 内存缓存时长 |
| `retainDeleted` | `true` | 保留已删除会话的用量 |
| `ledgerPath` | `<DSH_HOME>/storages/token-spend/ledger.json` | 账本路径 |

## 安装

通过 Plugin Manager（`install_bundle`）安装包目录或发布包，或把它加进 profile 的 bundle 列表。宿主代码改动需要重启应用；客户端代码随页面重新加载。

## 发布包

```bash
npm pack      # → dsh-token-spend-1.0.0.tgz（package/ 为根）
```

包内即 `files` 列表 + `README.md` + `LICENSE`。

## 许可

MIT © 2026 xiaobaga281
