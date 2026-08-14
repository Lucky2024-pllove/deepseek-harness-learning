# 提示词翻译文档：tool:ralph section（Ralph 工具使用政策）

## 元信息
- 原文件位置: `packages/workflow/tool-ralph/src/index.ts:407-411`
- 变量名称: `tool:ralph`（`ctx.systemPrompt.section({ name: 'tool:ralph', order: 116, ... })` 注册）
- 功能模块: `@deepseek-ai/dsh-tool-ralph` — Ralph 循环工具（foreground fresh-agent 循环）
- 调用场景: 每次模型推理步前，作为 system-prompt section 参与组装；声明 ralph 工具的使用政策（何时该用、与其他机制的分工）
- 来源分类: 生产代码

## 英文原文
```plaintext
Use the ralph tool ONLY when the direct human explicitly asks for a Ralph loop or fresh-agent iterative execution. Each Ralph round starts a fresh child with no conversation seed and uses the shared workspace as durable memory. Completion and blockers are worker reports, not independent evaluation. Use same-session goal tools for ordinary long-running objectives, and plain subagents or workflows for bounded delegation and fan-out.
```

## 中文翻译
```plaintext
仅当直接的人类用户明确要求 Ralph 循环或 fresh-agent（全新智能体）迭代执行时，才使用 ralph 工具。Ralph 的每一轮都会启动一个全新的子智能体，不携带任何对话种子，并以共享工作区作为长期记忆。完成与阻塞都是工作者报告，而非独立评估。对于普通的长期目标，请使用同会话的 goal 工具；对于有界委托与扇出，请使用普通的 subagent 或 workflow。
```

## 关键参数
- 无占位符。本 section 文本为静态字符串，注册于 order 116（工具指导带 100–199 内，紧跟 goal 的 115 之后）。

## Few-shot 示例
无

## 提示词链路
- 上游: `apply()`（`index.ts:405`）调用 `resolveConfig` 后注册本 section；ralph 工具本体随后经 `ctx.tools.register` 注册。
- 下游: 进入 `PromptAssembly.sections`，按 order 116 参与排序，作为工具指导带的一部分发送给模型。它约束模型：只有用户明确点名 Ralph/fresh-agent 时才调用 ralph 工具，避免与 goal/subagent/workflow 的职责混淆。

## 相关代码上下文
- 函数: `apply(ctx, config)`（`index.ts:405`）；`resolveConfig`（`index.ts:187`）。
- 关联工具: `ralph`（`defineTool`，`index.ts:412`），其 DESCRIPTION 见 `index.ts:179`。
- 机制: Ralph 是前台 fresh-agent 循环——每轮启动一个全新子代理，只传递不可变目标与上一轮有界结构化报告（`RALPH_SCRIPT`，`index.ts:90`）。
