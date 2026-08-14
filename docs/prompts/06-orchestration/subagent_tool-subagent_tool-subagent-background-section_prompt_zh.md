# 提示词翻译文档：tool:subagent background section（子代理后台运行指导）

## 元信息
- 原文件位置: `packages/subagent/tool-subagent/src/index.ts:459-465`
- 变量名称: `tool:subagent`（`ctx.systemPrompt.section({ name: `tool:${toolName}`, order: SUBAGENT_SECTION_ORDER, ... })` 注册）
- 功能模块: `@deepseek-ai/dsh-tool-subagent` — 子代理委托工具
- 调用场景: 仅当子代理工具启用后台模式（backgroundEnabled && continuable）时注册；作为 system-prompt section 指导模型默认后台运行子代理
- 来源分类: 生产代码

## 英文原文
```plaintext
Use subagent in the background by default. Start independent delegations together in one assistant message and continue useful work while they run. Set `run_in_background: false` only when your next action depends on that subagent's result. When a background run settles, the runtime sends you a notice containing its outcome and any final assistant message.
```

## 中文翻译
```plaintext
默认在后台使用 subagent。在同一条助手消息中一起启动相互独立的委派任务，并在它们运行时继续推进有用的工作。仅当你的下一步操作依赖于该子代理的结果时，才设置 `run_in_background: false`。当后台运行结束时，运行时会向你发送一条通知，其中包含其结果以及任何最终的助手消息。
```

## 关键参数
- `${toolName}`：工具名（`subagent` 或 `subagent_fork`，来自 config），JS 模板字符串插值。
- text 为 provider 函数：当工具未注册时返回空字符串（该 section 不渲染）。

## Few-shot 示例
无

## 提示词链路
- 上游: `apply()` 在 `backgroundEnabled && continuable` 条件下注册本 section（order = SUBAGENT_SECTION_ORDER）。
- 下游: 进入 `PromptAssembly.sections`，指导模型后台并行委派、不空转等待。

## 相关代码上下文
- 函数: `apply(ctx, config)`（`index.ts` 尾部，`index.ts:455-467`）。
- 关联工具: `subagent` / `subagent_fork`（同文件 `defineTool` 注册）。
- 机制: 子代理有 spawn（全新上下文）/fork（继承前缀）两种 provider，后台模式为 continuable（可后续 send_message 续聊）。
