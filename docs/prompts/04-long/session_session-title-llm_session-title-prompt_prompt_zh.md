# 提示词翻译文档

## 元信息
- 原文件位置: `packages/session/session-title-llm/src/index.ts:186-193`
- 变量名称: `systemPrompt(config: ResolvedSessionTitleLlmConfig)`（内部函数，稳定、语言感知的系统指令）
- 功能模块: 会话标题生成（session-title-llm）—— 用 LLM 为会话生成标题的辅助调用
- 调用场景: 两个标题提供方插件共享该系统指令；`generateSessionTitleWithLlm` 把它作为 `GenerateOptions.system` 传入辅助 LLM 调用（`index.ts:250,256`），与 `frameMessages` 构造的用户消息配对。会话标题在会话初始化/自动节奏触发时生成。
- 来源分类: 生产代码

## 英文原文
```text
Create a concise title for an AI coding-assistant session from the supplied human messages.
Return only the title on one line, **in plain text of natural language**, with no quotes, prefix, explanation, Markdown, XML, or terminal control codes. No code is allowed.
Use the language of the messages.
Aim for about ${config.targetWords} words in non-CJK languages or ${config.targetCjkCharacters} CJK characters.
```

## 中文翻译
```text
根据提供的人类消息，为一个 AI 编程助手会话创建简洁的标题。
只返回一行标题，**以自然语言的纯文本形式**，不带引号、前缀、解释、Markdown、XML 或终端控制码。不允许包含任何代码。
使用消息所用的语言。
目标长度：非中日韩（CJK）语言约 ${config.targetWords} 个单词，中日韩语言约 ${config.targetCjkCharacters} 个字符。
```

## 关键参数
- `${config.targetWords}`：非 CJK 语言的目标词数（`ResolvedSessionTitleLlmConfig.targetWords`，配置字段）。
- `${config.targetCjkCharacters}`：CJK 语言的目标字符数（`ResolvedSessionTitleLlmConfig.targetCjkCharacters`，配置字段）。
- 两个 `${...}` 为运行时模板插值，保持原样；最终模型看到的是一行数字文本。
- 相关参数（调用侧）：`frameMessages` 输出 `Generate the session title from this JSON array of human messages:\n${JSON.stringify(messages)}` 作为用户消息（JSON 框定防止用户文本破坏结构定界符）；`maxOutputTokens`（`config.maxOutputTokens`）、`timeoutMs`、`maxInputBytes` 约束调用。

## Few-shot 示例
无

## 提示词链路
- 注入时机：每次标题生成请求调用 `generateSessionTitleWithLlm` 时，`systemPrompt(config)` 作为 `system` 字段随 `messages`（单条用户消息，含 JSON 框定的人类消息数组）一起发送给 `ctx.llm.stream(options)`（`index.ts:252-261`）；调用前后均检查 `signal` 中止状态。
- 上游：`selectMessages(request.messages)` 选出的消息子集（`SessionTitleUserMessage[]`）→ `frameMessages` JSON 框定；模型路由由 `resolveRoute` 解析（显式配置的 provider/model 或从 `request/header` 捕获的路由）。
- 下游：`BlockAssembler` 汇总输出 → 文本拼接 → `normalizeSessionTitle` 归一化；输出含工具调用块抛错（标题必须纯文本）；`finishError` 把终止原因（error/aborted/max-tokens/tool-calls）映射为失败。成功后写入 `session/title-llm-request` 事件（含 `system` 与 `messages` 快照）并返回 `{ title, messageSeqs, model }`。
- 调用链：`registerSessionTitleLlmProvider` 把 `generate` 注册进 `ctx.sessionTitle.register`；`automatic` 模式由提供方决定自动生成节奏。

## 相关代码上下文
- 源码注释（`index.ts:185`）：「Stable language-aware system instruction shared by both provider plugins.」（两个提供方插件共享的稳定、语言感知系统指令）。
- `normalizeSessionTitle` 与 `frameMessages` 保证标题归一化与输入框定；该提示词刻意要求「语言跟随消息语言」「无 Markdown/XML/控制码」，与后续归一化步骤（去引号、去前缀等）配合。
