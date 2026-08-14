# 提示词翻译文档

## 元信息
- 原文件位置: `packages/context/time-context/src/index.ts:110-125`（模板字符串在第 122-124 行）
- 变量名称: `renderText(now, turn, step, previous, formatter, timeZone, browserContext)`（模板函数）
- 功能模块: 时间上下文插件（time-context，opt-in 请求时钟上下文）
- 调用场景: 合格 step 的请求准备期（`agent/pre-step`）注入一条持久化、带来源归属的时间读数用户消息
- 来源分类: 生产代码

## 英文原文

### 模板源码
```
`Time sampled while preparing turn ${turn}, step ${step}: ${formatTimestamp(now, formatter, timeZone)}\n`
+ `${browserText}\n`
+ `Elapsed since the preceding ${baseline}: ${elapsed}.`
```
其中 `baseline = step === 1 ? 'model-visible message' : 'step context'`，`elapsed = previous === undefined ? 'unavailable' : formatDuration(now - previous)`。

### 完整组装形态（示例）
```
Time sampled while preparing turn 3, step 1: 2026-01-15 10:30:00 UTC+08
<browser time zone context text>
Elapsed since the preceding model-visible message: 5s.
```

## 中文翻译
```
在准备第 ${turn} 轮、第 ${step} 步时采样的时间：${formatTimestamp(now, formatter, timeZone)}
${browserText}
自前一个${baseline}以来经过的时间：${elapsed}。
```
- `${baseline}`：`step === 1` 时为 `model-visible message`（模型可见消息），否则为 `step context`（步骤上下文）
- `${elapsed}`：无前基线时为 `unavailable`（不可用）；否则为紧凑整秒时长（如 `5s`、`1m 3s`、`2h 5m 0s`）

## 关键参数
- `${turn}` / `${step}` — 当前回合号与步骤号
- `${formatTimestamp(now, formatter, timeZone)}` — 按所选时区（浏览器时区或回退时区）格式化的当前时间戳；formatter 经 `formatterFor` 缓存
- `${browserText}` — `renderBrowserTimeZoneContext(browserContext)` 渲染的浏览器时区上下文文本（可能为空行）
- `${baseline}` — 基线描述：首步（step 1）为 `model-visible message`，后续步为 `step context`
- `${elapsed}` — 距前一基线经过的时间，`formatDuration` 紧凑格式（`Xd`/`Xh`/`Xm`/`Xs`），无基线时为 `unavailable`

## Few-shot 示例
无

## 提示词链路
- 上游: `agent/pre-step`（`{ prepend: true }`）监听器（第 170-208 行）在 `next()` 放行后，经 `latestInjectionTime` 的 `refreshIntervalMs` 抑制、`precedingMessageTime`/`precedingStepContextTime` 求基线、`deriveBrowserTimeZoneContext` 选时区，再调用 `renderText`
- 下游: 生成的文本经 `createUserMessage` 打包（source `{kind:'plugin', plugin:'time-context', form:'snapshot', sections:[{name, text}]}`），追加到 `decision.messages` 末尾（`kind:'enter'` 决策），进入模型请求并持久化到会话日志
- 注入时机与 order: 每个合格 step 的请求准备期注入一次（`refreshIntervalMs` 抑制重复，省略或为 0 则每步注入）；`prepend: true` 使该监听器先于其他 pre-step 监听器执行；非 `systemPrompt.section` 注入，无 order —— 属于 pre-step 决策的 `messages` 快照通道

## 相关代码上下文
`time-context/src/index.ts`：`renderText` 定义于第 110-125 行；`formatDuration`（第 41-55 行）与 `formatTimestamp`/`createTimestampFormatter`（`timestamp.ts`）；`precedingMessageTime`（第 58-71 行）/`precedingStepContextTime`（第 74-84 行）/`latestInjectionTime`（第 87-96 行）/`requestMessages`（第 99-108 行）；配置 `timeZone` 与 `refreshIntervalMs`（第 27-38 行），非法值插件加载即失败。
