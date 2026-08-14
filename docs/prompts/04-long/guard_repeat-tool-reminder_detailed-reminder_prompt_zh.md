## 元信息
- 原文件位置: `packages/guard/repeat-tool-reminder/src/index.ts:70-79`
- 变量名称: `detailedReminder(toolName, count, canonicalArguments)`（模板函数）
- 功能模块: 重复工具调用提醒护栏（repeat-tool-reminder guard）
- 调用场景: 模型的连续重复工具调用计数命中 `thresholds` 中首个阈值之后的更高阈值（默认 5/8）时，生成指名工具、连击次数与规范化参数的详细提醒
- 来源分类: 生产代码

## 英文原文
```
Repeated tool call detected:
- tool: ${toolName}
- consecutive_calls: ${count}
- arguments: ${canonicalArguments}
The repeated calls are not making progress. Do not call this tool with these exact arguments again. Inspect the latest result and choose a different action, different arguments, or finish the task if enough evidence has been gathered.
```

## 中文翻译
```
检测到重复的工具调用：
- tool: ${toolName}
- consecutive_calls: ${count}
- arguments: ${canonicalArguments}
这些重复调用没有取得进展。不要再使用这些完全相同的参数调用该工具。请检查最新结果，选择不同的动作、不同的参数，或者如果已经收集到足够的证据，就完成任务。
```

## 关键参数
- `${toolName}` — 被重复调用的工具名（`exec.name`）
- `${count}` — 连续重复次数（链计数，`chain.count`）
- `${canonicalArguments}` — 规范化后的参数字符串：深度按键排序后 `JSON.stringify`（`canonicalize`），模型可见文本再经 `previewArguments` 截断到 `argumentsPreviewChars`（默认 500 字符），超出部分以 `… (+N more chars)` 标注省略量。检测链键始终使用完整规范化字符串，截断只约束模型可见文本

## Few-shot 示例
无

## 提示词链路
- 上游: `observe(exec)` 在 `tools/post-execute` 中计数，当 `count` 命中 `thresholdSet` 且非首阈值时调用 `detailedReminder(exec.name, count, previewArguments(canonical, argumentsPreviewChars))`（第 202 行）
- 下游: 与 GENTLE_REMINDER 相同 —— 经 `createUserMessage` 生成 `{kind:'plugin', plugin:'repeat-tool-reminder', form:'notice', summary}` 用户消息，`prependContext` 前置到 `PostToolDecision.additionalContexts`，随下一次模型请求进入上下文
- 注入时机与 order: 工具执行后（`tools/post-execute`，第 213-224 行）；非 `systemPrompt.section` 注入，无 order。降级语义：`count === thresholds[0]` 用温和提醒，更高阈值用详细提醒（第 200-202 行）

## 相关代码上下文
`index.ts`：`detailedReminder` 定义于第 70-79 行；`canonicalize`（第 103-105 行）、`previewArguments`（第 118-121 行）、`validateThresholds`（第 128-141 行，升序归一化）支撑生成；`argumentsPreviewChars` 默认 500（第 49 行）。
