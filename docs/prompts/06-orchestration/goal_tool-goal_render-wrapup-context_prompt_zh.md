# 提示词翻译文档：renderWrapupContext（目标收尾指令）

## 元信息
- 原文件位置: `packages/goal/tool-goal/src/wrapup.ts:17-40`
- 变量名称: `renderWrapupContext(objective, blockedReason?)`
- 功能模块: `@deepseek-ai/dsh-tool-goal` — 目标工具收尾上下文
- 调用场景: 目标 round 报告 complete 或 blocked 后，经 `ToolRunContext.deferContext()` 注入，替代原先的硬性回合停止，让模型在回合结束前仍向用户写结语
- 来源分类: 生产代码

## 英文原文
```plaintext
<goal_complete>
Objective: "<objective>"
The goal is marked complete and this autonomous run is ending. Write the closing message to the user now: state the outcome, summarize what was done and how it was verified, and point to the concrete results (files, commits, or other artifacts). Report only what earlier rounds and tool results in this session actually establish; when a detail is not in the session, say so instead of inventing it. Note anything the user should review or do next. Address the user directly. Do not call any more tools in this run; further work waits for the user's next instruction.
</goal_complete>
```

（`blocked` 分支为 `<goal_blocked>` 帧，含 `Blocked: "<blockedReason>"`，正文要求说明已完成内容、具体阻塞条件、尝试过什么、需要用户提供什么才能继续。）

## 中文翻译
```plaintext
<goal_complete>
目标："<objective>"
该目标已标记为完成，本次自主运行即将结束。现在向用户写结语：陈述结果，总结完成了什么以及如何验证的，并指向具体成果（文件、提交或其他产物）。只报告本会话中早前轮次与工具结果实际确立的内容；当某个细节不在会话中时，如实说明而不是凭空编造。指出用户需要审查或后续要做的任何事项。直接面向用户。本次运行中不要再调用任何工具；后续工作等待用户的下一条指令。
</goal_complete>
```

## 关键参数
- `${JSON.stringify(objective)}` / `${JSON.stringify(blockedReason)}`：目标与阻塞原因经 JSON 序列化嵌入（防注入/防结构破坏）。

## Few-shot 示例
无

## 提示词链路
- 上游: `update_goal` 工具执行 complete/blocked 动作时，调用 `renderWrapupContext(goal.objective[, blocked_reason])`（`tool-goal/src/index.ts:316-317`），结果经 `deferContext` 注入。
- 下游: 作为额外上下文进入模型历史，模型据此写结语后回合结束。

## 相关代码上下文
- 函数: `renderWrapupContext`（`wrapup.ts:17`）；`GROUNDING`（`wrapup.ts:5`，要求只报告会话中实际确立的内容）。
- 关联: `update_goal` 工具的 complete/blocked 分支（`tool-goal/src/index.ts`）。
