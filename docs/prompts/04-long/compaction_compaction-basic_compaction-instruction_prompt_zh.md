## 元信息
- 原文件位置: `packages/compaction/compaction-basic/src/summarizer.ts:31-66`
- 变量名称: `COMPACTION_INSTRUCTION`
- 功能模块: 基础压缩（compaction-basic）—— 单次对话压缩与持久化检查点框架
- 调用场景: 压缩指令以「回放对话之后的最后一条用户消息」形式交付（而非独立的压缩器系统提示词），使辅助调用成为最后一次已路由请求的真实前缀，从而复用提供方的 KV 缓存而不是使其失效。由 `summarizeWithLlm` 作为 final user message 追加到消息列表。
- 来源分类: 生产代码

## 英文原文
```text
You are now acting as a compaction engine for this AI coding assistant. Condense the conversation ABOVE into a structured checkpoint that lets another model resume the work with no loss of essential context.

Output EXACTLY the Markdown structure below: keep every section, in order. Use terse bullets, not prose paragraphs. Write "(none)" for an empty section — never drop a section.

## Primary Request and Intent
- [the user's original and evolving goals; quote verbatim where the exact wording matters]

## Key Technical Concepts
- [technologies, frameworks, patterns, and conventions in play]

## Files and Code
- [exact path: why it matters, key changes or snippets]

## Errors and Fixes
- [error: how it was resolved, plus any related user feedback]

## Pending Jobs
- [explicitly requested work not yet completed]

## Current Work
- [precisely what was in progress at this checkpoint]

## Next Step
- [the single next action, directly in line with the most recent request, or "(none)"]

## Critical Context
- [decisions and their rationale, constraints, user preferences, open questions, data needed to continue]

Rules:
- Write concise English engineering prose. Preserve exact file paths, commands, error strings, identifiers, numeric values, function signatures, and syntax fragments.
- Capture user feedback and explicit instructions faithfully, especially corrections.
- Do NOT mention this summarization request or that the context was compacted.
- Output only the checkpoint text: do not call any tool or take any other action.
- If the conversation already contains a <compacted-summary> block, it is a PRIOR checkpoint. Do not copy it forward verbatim: preserve still-true facts, drop stale ones, and merge newer information into a single consolidated summary under the same structure.
```

## 中文翻译
```text
你现在充当这个 AI 编程助手的压缩引擎（compaction engine）。请把「上方」的对话压缩成一个结构化检查点（checkpoint），使另一个模型能够在零关键上下文损失的情况下继续这项工作。

严格按下面的 Markdown 结构输出：保留每一个小节，顺序不变。使用简练的要点（bullets），不要使用散文段落。空的小节写 "(none)"——绝不丢弃任何一个小节。

## Primary Request and Intent
- [用户的原始目标与演变中的目标；在措辞本身重要的地方逐字引用]

## Key Technical Concepts
- [涉及的技术、框架、模式与约定]

## Files and Code
- [精确路径：为什么重要、关键变更或代码片段]

## Errors and Fixes
- [错误：如何解决的，以及任何相关的用户反馈]

## Pending Jobs
- [明确要求但尚未完成的工作]

## Current Work
- [此检查点时刻正在进行的确切工作]

## Next Step
- [与最近一次请求直接一致的单一下一步行动，或 "(none)"]

## Critical Context
- [决策及其理由、约束、用户偏好、未决问题、继续工作所需的数据]

规则：
- 撰写简洁的英文工程文体。保留精确的文件路径、命令、错误字符串、标识符、数值、函数签名和语法片段。
- 忠实地记录用户反馈与明确指令，尤其是纠正性的内容。
- 不要提及本次总结请求，也不要提及上下文已被压缩。
- 只输出检查点文本：不要调用任何工具，也不要采取任何其他行动。
- 如果对话中已经包含 <compacted-summary> 块，那是一个「先前检查点」。不要逐字向前复制它：保留仍然成立的事实，丢弃已过时的内容，并把更新的信息合并进同一结构下的单一汇总摘要。
```

## 关键参数
- `<compacted-summary>`（源码中的 `SUMMARY_OPEN_TAG`，`summarizer.ts:21`）：包裹结构化摘要的开放标签；最后一条规则通过模板插值 `${SUMMARY_OPEN_TAG}` 注入，运行时渲染为 `<compacted-summary>`，保持原样。闭合标签为 `</compacted-summary>`（`SUMMARY_CLOSE_TAG`）。
- 固定小节标题（`## Primary Request and Intent` 等 8 个）必须逐字保留、顺序不变；`- [...]` 为模型侧的填写模板（方括号内的说明是给压缩模型的指令）。
- `"(none)"`：空小节的标准占位写法，绝不允许删除小节。
- 无 `${...}` 用户数据占位符（唯一的插值 `${SUMMARY_OPEN_TAG}` 是编译期常量）。

## Few-shot 示例
无（`- [...]` 各行是待填模板而非示例）

## 提示词链路
- 注入时机：`summarizeWithLlm`（`summarizer.ts:121-182`）把 `input.messages`（被遮蔽区域，按表面顺序）逐条回放后，追加 `createUserMessage({ content: [{ type: 'text', text: COMPACTION_INSTRUCTION }], source: { kind: 'plugin', plugin: 'dsh-compaction-basic' } })`（第 148-151 行）作为最后一条用户消息；`GenerateOptions` 复用对话自身的 `system`（若存在）与 `tools`（若存在），对齐前缀缓存。
- 上游：`input.messages` —— 上次路由请求最后一段的会话消息前缀；`input.system` / `input.tools` —— 会话系统提示词与工具 schema（前缀缓存对齐用）。
- 下游：`ctx.llm.stream(options)` 输出经 `summaryText` 过滤（拒绝图片输出、只留文本）后，由 `frameSummary` 包裹成 `CHECKPOINT_PREAMBLE + <compacted-summary> ... </compacted-summary>` 的合成替换用户消息；模型输出不得含工具调用，达到 `maxTokens` 截断抛 `MAX_TOKENS` 错误（不完整的检查点）。
- 调用链：`summarizeWithLlm` 由压缩服务在触发压缩时调用；目标 provider/model 取「配置的 summarization 字段 > 最近一次请求路由 > agent 选项」的优先级。

## 相关代码上下文
- 注释（`summarizer.ts:24-30`）解释设计动机：保持对话自身的系统提示词、工具与消息前缀在前，使辅助调用成为最后一次路由请求的真实前缀，复用提供方 KV 缓存。
- `frameSummary`（`summarizer.ts:189-195`）把 `CHECKPOINT_PREAMBLE` 与 `<compacted-summary>` 标签组合进合成用户消息；后续压缩轮次会识别已存在的 `<compacted-summary>` 块并合并而非复制。
