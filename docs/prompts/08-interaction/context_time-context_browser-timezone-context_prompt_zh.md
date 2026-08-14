## 元信息
- 原文件位置: `packages/context/time-context/src/request-zone.ts:66-81`
- 变量名称: `renderBrowserTimeZoneContext(context)`
- 功能模块: `@deepseek-ai/dsh-time-context` — 浏览器时区上下文渲染
- 调用场景: 为当前请求渲染一条持久的浏览器时区政策行；由 `renderText` 的 `${browserText}` 拼入时间上下文快照
- 来源分类: 生产代码

## 英文原文

### resolved（单一明确时区）
```text
Browser time zone for this request: ${context.timeZone}. Interpret otherwise-unqualified dates and times in this zone.
```

### mixed（混合时区）
```text
Browser time zone for this request: mixed ${JSON.stringify(context.timeZones)}. Ask the user to clarify otherwise-unqualified dates and times.
```

### missing（时区缺失）
```text
Browser time zone for this request: unavailable. Ask the user to clarify otherwise-unqualified dates and times.
```

## 中文翻译

### resolved
```text
本请求的浏览器时区：${context.timeZone}。将未明确限定日期的日期与时间按此时区解读。
```

### mixed
```text
本请求的浏览器时区：混合 ${JSON.stringify(context.timeZones)}。对于未明确限定日期的日期与时间，请向用户询问澄清。
```

### missing
```text
本请求的浏览器时区：不可用。对于未明确限定日期的日期与时间，请向用户询问澄清。
```

## 关键参数
- `${context.timeZone}`：单一解析时区名（如 `UTC+08`）。
- `${JSON.stringify(context.timeZones)}`：混合时区列表（JSON 序列化）。

## Few-shot 示例
无

## 提示词链路
- 上游: `deriveBrowserTimeZoneContext` 从请求消息中的浏览器时区信息派生 `resolved`/`mixed`/`missing` 三种之一。
- 下游: `renderBrowserTimeZoneContext` 的输出作为 `${browserText}` 拼入 `renderText`（`time-context/src/index.ts:110`）的时间快照，随 `agent/pre-step` 注入。

## 相关代码上下文
- 函数: `renderBrowserTimeZoneContext`（`request-zone.ts:66`）、`deriveBrowserTimeZoneContext`（`request-zone.ts`）。
- 关联: `renderText`（`time-context/src/index.ts:110`，见 time-context 翻译文档）。
