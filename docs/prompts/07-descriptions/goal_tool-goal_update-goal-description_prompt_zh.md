## 元信息
- 原文件位置: `packages/goal/tool-goal/src/index.ts:236-239`
- 变量名称: `update_goal` 工具的 `description`
- 功能模块: `@deepseek-ai/dsh-tool-goal` — 目标工具
- 调用场景: 作为 `update_goal` 工具的 description 注入模型
- 来源分类: 生产代码

## 英文原文
```plaintext
Update the exact current goal revision. edit, pause, and resume require a direct top-level human request. During an automatic continuation of the current goal, complete and blocked are also allowed. blocked is rejected before the configured minimum round count; the model remains responsible for judging that the same condition persisted across those rounds and must explain it in blocked_reason.
```

## 中文翻译
```plaintext
更新精确的当前目标修订。edit、pause 与 resume 需要直接顶层的用户请求。在当前目标的自动续跑期间，complete 与 blocked 也被允许。blocked 在达到配置的最小轮次数之前会被拒绝；模型仍负责判断同一条件在这些轮次中持续存在，并且必须在 blocked_reason 中说明它。
```

## 关键参数
- `goal_id` / `revision`：get_goal 返回的精确 id 与 revision。
- `action`：edit | pause | resume | complete | blocked。
- `blocked_reason`：仅 blocked 动作需要。

## Few-shot 示例
无

## 提示词链路
- 上游: `defineTool({ name: 'update_goal', description: ..., ... })`（`index.ts:234`）。
- 下游: 作为工具 Schema 的 description 注入模型，与 `tool:goal` section（order 115）配套。

## 相关代码上下文
- 关联: `guidance()`（`index.ts:113`，tool:goal section）、`CREATE_DESCRIPTION`（`index.ts:45`）、`renderWrapupContext`（`wrapup.ts`）。
