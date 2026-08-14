## 元信息
- 原文件位置: `packages/compaction/compaction-basic/src/summarizer.ts:69-70`
- 变量名称: `CHECKPOINT_PREAMBLE`
- 功能模块: 基础压缩（compaction-basic）—— 合成替换用户消息的前置框架文本
- 调用场景: `frameSummary`（`summarizer.ts:189-195`）把该前置文本与 `<compacted-summary>` 开放标签拼接到模型生成的摘要之前，产出一条合成的替换用户消息（replacement user message），使被压缩的旧对话区域成为「既定上下文」。
- 来源分类: 生产代码

## 英文原文
```text
This is an automatically generated checkpoint condensing an earlier span of the conversation to free up context. Treat the captured context as established background and build on it without restating it. Continue the task directly from the messages that follow, without acknowledging this checkpoint.
```

## 中文翻译
```text
这是一个自动生成的检查点（checkpoint），用于压缩对话中较早的一段内容以释放上下文。请将所捕获的上下文视为已确立的背景（established background），在其基础上继续推进，而不要重复陈述。请直接从后续的消息继续任务，无需提及此检查点。
```

## 关键参数
- 无动态占位符；固定字符串常量。
- 语义要点：告知模型该检查点是自动生成的、被捕获内容应视为既定背景（不重复）、直接从后续消息继续且不要提及检查点本身。
- 相关标签（`frameSummary` 中组合）：`<compacted-summary>` / `</compacted-summary>` 包裹模型生成的摘要内容。

## Few-shot 示例
无

## 提示词链路
- 注入时机：压缩完成后，`frameSummary(summary)` 输出 `[{ text: CHECKPOINT_PREAMBLE + "\n\n" + SUMMARY_OPEN_TAG }, ...summary, { text: SUMMARY_CLOSE_TAG }]`，即合成替换用户消息的内容块序列；该消息取代被压缩的旧消息区域进入会话历史。
- 上游：`summarizeWithLlm` 产出的文本摘要内容块（`summary: ContentBlock[]`）。
- 下游：合成替换用户消息随会话历史进入后续模型请求；下一轮压缩通过识别已存在的 `<compacted-summary>` 块做合并（见 COMPACTION_INSTRUCTION 最后一条规则），而非复制。

## 相关代码上下文
- 源码注释（`summarizer.ts:68`）：「Framing that makes the replacement user message established context.」（使替换用户消息成为既定上下文的框架）。
- `frameSummary` 是模块内纯函数，与 `SUMMARY_OPEN_TAG` / `SUMMARY_CLOSE_TAG`（`summarizer.ts:21-22`）配合；摘要内容本身经 `summaryText` 保证仅含文本。
