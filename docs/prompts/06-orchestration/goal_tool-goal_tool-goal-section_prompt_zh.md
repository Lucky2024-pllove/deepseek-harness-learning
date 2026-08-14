## 元信息
- 原文件位置: `packages/goal/tool-goal/src/index.ts:113-123`（`guidance()` 函数）
- 变量名称: `tool:goal`（`ctx.systemPrompt.section({ name: 'tool:goal', order: 115, text: guidance(...) })` 注册）
- 功能模块: `@deepseek-ai/dsh-tool-goal` — 同会话目标（goal）工具集
- 调用场景: 每次模型推理步前，作为 system-prompt section 参与组装；声明 create_goal/get_goal/update_goal 的使用政策与 blocked 判定门槛
- 来源分类: 生产代码

## 英文原文
```plaintext
Use goal tools for one long-running completion objective in the current session. create_goal may infer goal intent from a direct human request in any language; do not create a goal for routine single-turn work. Call get_goal before update_goal and copy its exact goal_id and revision. After session resume or fork, an active goal is disarmed: when a human asks to continue or resume in any wording or language, use update_goal action resume to rearm it. Mark complete only when the objective is actually achieved. Mark blocked only after the same blocking condition persists for at least ${blockedAfter} consecutive goal rounds, and report that concrete condition in blocked_reason; difficulty, uncertainty, or useful remaining work is not blocked.
```

## 中文翻译
```plaintext
在当前会话中，使用 goal 工具来处理一个长期运行的完成目标。create_goal 可以从任何语言的直接人类请求中推断目标意图；不要为常规的单轮工作创建目标。调用 update_goal 之前先调用 get_goal，并复制其精确的 goal_id 和 revision。会话恢复或 fork 之后，活跃目标会被解除武装：当人类以任何措辞或语言要求继续或恢复时，使用 update_goal 的 resume 动作重新武装它。只有在目标实际达成时才标记 complete。只有在同一阻塞条件持续至少 ${blockedAfter} 个连续目标轮次之后，才标记 blocked，并在 blocked_reason 中报告该具体条件；困难、不确定性或有价值的剩余工作都不是阻塞。
```

## 关键参数
- `${blockedAfter}`：部署配置 `blockedAfterConsecutiveRounds`（默认 3）插值进来的轮次门槛（JS 模板字符串，注册时求值，非提示词 `{{variable}}` 占位符）。

## Few-shot 示例
无

## 提示词链路
- 上游: `guidance(blockedAfter)`（`index.ts:113`）由 `resolveConfig`（`index.ts:126`）解析的 `blockedAfterConsecutiveRounds` 生成，在 `apply()` 中注册为 order 115 的 section。
- 下游: 进入 `PromptAssembly.sections`，按 order 115 参与排序（沙箱 110 / 会话查询 113 / workflow 115 / ralph 116 一带），作为工具指导带的一部分约束模型对 goal 工具的使用。

## 相关代码上下文
- 函数: `guidance(blockedAfter)`（`index.ts:113`）、`resolveConfig`（`index.ts:126`）。
- 关联工具: `create_goal`（`CREATE_DESCRIPTION`，`index.ts:45`）、`get_goal`、`update_goal`（`index.ts:236`）。
- 机制: 目标是持久化的同会话完成目标，可跨自动续跑轮次推进；`wrapup.ts` 提供 complete/blocked 的收尾指令。
