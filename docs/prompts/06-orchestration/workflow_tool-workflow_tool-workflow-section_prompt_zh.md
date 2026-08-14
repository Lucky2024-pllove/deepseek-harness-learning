# 提示词翻译文档：tool:workflow section（Workflow 工具使用政策）

## 元信息
- 原文件位置: `packages/workflow/tool-workflow/src/index.ts:212-216`
- 变量名称: `tool:workflow`（`ctx.systemPrompt.section({ name: `tool:${toolName}`, order: 115, ... })` 注册，toolName 默认 `workflow`）
- 功能模块: `@deepseek-ai/dsh-tool-workflow` — 工作流编排工具
- 调用场景: 每次模型推理步前，作为 system-prompt section 参与组装；声明 workflow 工具的使用政策（仅显式要求时用）
- 来源分类: 生产代码

## 英文原文
```plaintext
Use the workflow tool ONLY when the user explicitly asks for a workflow or for large multi-agent orchestration: you write a JavaScript script (the tool description documents the exact format) that fans work out across many subagents with phases and structured results. For one or two delegations, prefer plain subagent calls.
```

## 中文翻译
```plaintext
仅当用户明确要求工作流或大规模多智能体编排时，才使用 workflow 工具：你编写一个 JavaScript 脚本（工具描述中记录了确切格式），它通过阶段与结构化结果，将工作扇出到许多子智能体。对于一两个委派任务，请优先使用普通的 subagent 调用。
```

## 关键参数
- `${toolName}`：工具名（默认 `workflow`，来自 config），JS 模板字符串插值。
- 无 `{{variable}}` 占位符。

## Few-shot 示例
无

## 提示词链路
- 上游: `apply()`（`index.ts:205`）从 config 解析 `toolName` 后注册本 section；workflow 工具本体随后注册。
- 下游: 进入 `PromptAssembly.sections`，按 order 115 参与排序，约束模型仅在大规模多智能体编排场景才用 workflow，小规模优先 subagent。

## 相关代码上下文
- 函数: `apply(ctx, config)`（`index.ts:205`）。
- 关联工具: `workflow`（`defineTool`，`index.ts:217`），其 DESCRIPTION 见 `index.ts:138`（脚本编写契约）。
- 机制: workflow 由 worker-thread 引擎执行模型编写的 JavaScript 脚本，通过 `agent()`/`pipeline()`/`parallel()` 钩子扇出子代理。
