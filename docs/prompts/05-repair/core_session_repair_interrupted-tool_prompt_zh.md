# 提示词翻译文档

## 元信息
- 原文件位置: `packages/core/session/src/repair.ts:103-105`
- 变量名称: 内联于 `interruptedTurnClosers()` 的 `ToolResultMessage.content[].text`（按 `started` 布尔分支选择；无独立命名常量）
- 功能模块: 崩溃恢复修复（Crash-recovery repair，session）
- 调用场景: 会话日志因崩溃而中断时，为悬空的工具调用合成错误 `tool/result` 事件。两条文本分别对应：`started === true`（工具调用已被记录但结果未持久化）与 `started === false`（工具调用从未被记录为已开始）
- 来源分类: 生产代码

## 英文原文

### started 分支（第 103-104 行，结果未知）
```
The tool call was interrupted after it was recorded, but no result was durably recorded. Its outcome is unknown. Decide whether to retry from the tool semantics: retry only if the operation is read-only or idempotent; if it may have side effects, first verify external state or ask the user. Do not retry blindly.
```

### not-started 分支（第 105 行，未开始）
```
The tool call was interrupted before the Harness recorded it as started. Retry it if it is still needed.
```

## 中文翻译

### started 分支（结果未知）
```
该工具调用在已被记录之后被中断，但没有任何结果被持久化记录。其执行结果未知。请根据工具语义决定是否重试：仅当该操作是只读或幂等的时才重试；如果它可能产生副作用，请先核实外部状态或询问用户。不要盲目重试。
```

### not-started 分支（未开始）
```
该工具调用在 Harness 记录其为已开始之前被中断。如果仍然需要，请重试它。
```

## 关键参数
- 无占位符；两条文本由局部布尔量 `started = callSeq !== undefined`（第 92 行）选择
- 配套错误码：`started` 分支 → `{ name: 'ToolOutcomeUnknownError', code: TOOL_OUTCOME_UNKNOWN }`；not-started 分支 → `{ name: 'ToolNotStartedError', code: TOOL_NOT_STARTED }`

## Few-shot 示例
无

## 提示词链路
- 上游: `interruptedTurnClosers(events)` 扫描已加载的持久化日志，`pendingCalls` 中记录了 `assistant/message` 的工具调用块、但无对应 `tool/result` 事件的调用进入修复
- 下游: 生成的合成 `tool/result` 事件（`isError: true`）追加到会话日志，随后按序补 `step/end` 与 `turn/end`（reason `{kind:'interrupted'}`），使日志恢复为 provider 可接受的平衡形态；合成结果作为错误工具结果进入模型请求
- 注入时机与 order: 崩溃恢复时、恢复会话前由修复流程调用；非 `systemPrompt.section` 注入，无 order —— 属于会话事件恢复（repair）通道。时间戳复用最后一个真实事件、seq 从 `last.seq + 1` 递增，保证确定性

## 相关代码上下文
`repair.ts` `interruptedTurnClosers`（第 27-133 行）：`started` 判定来自 `tool/call` 事件是否登记了 `callSeq`（第 59-67 行）；`TOOL_NOT_STARTED`/`TOOL_OUTCOME_UNKNOWN` 常量定义于第 13/16 行；平衡或空日志返回空数组（第 80 行）。
