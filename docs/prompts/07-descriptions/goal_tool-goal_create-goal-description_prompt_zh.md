## 元信息
- 原文件位置: `packages/goal/tool-goal/src/index.ts:45-49`
- 变量名称: `CREATE_DESCRIPTION`
- 功能模块: `@deepseek-ai/dsh-tool-goal` — 目标工具
- 调用场景: 作为 `create_goal` 工具的 description 注入模型
- 来源分类: 生产代码

## 英文原文
```plaintext
Create one persisted same-session completion goal when the current direct human request is a long-running objective that should continue across autonomous goal rounds. You may infer that intent without requiring the user to say "create a goal". Do not use this for trivial single-turn work. Execution rejects non-human and subagent authority.
```

## 中文翻译
```plaintext
当当前直接的人类请求是一个应跨越自主目标轮次持续推进的长期目标时，创建一个持久化的同会话完成目标。你可以在不要求用户说出"创建一个目标"的情况下推断该意图。不要为琐碎的单轮工作使用它。执行会拒绝非人类与子智能体的权限。
```

## 关键参数
- `objective`：具体完成目标（从直接人类请求推断）。
- `max_goal_rounds`：可选的正整数轮次上限。

## Few-shot 示例
无

## 提示词链路
- 上游: `defineTool({ name: 'create_goal', description: CREATE_DESCRIPTION, ... })`（`index.ts`）。
- 下游: 作为工具 Schema 的 description 注入模型，与 `tool:goal` section（order 115）配套。

## 相关代码上下文
- 常量: `CREATE_DESCRIPTION`（`index.ts:45`）。
- 关联: `guidance()`（`index.ts:113`，tool:goal section）、`update_goal`（`index.ts:236`）。
