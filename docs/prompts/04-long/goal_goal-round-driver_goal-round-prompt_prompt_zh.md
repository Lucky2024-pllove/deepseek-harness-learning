# 提示词翻译文档

## 元信息
- 原文件位置: `packages/goal/goal-round-driver/src/prompt.ts:12-25`
- 变量名称: `renderGoalRoundPrompt(goal: GoalView, round: number): ContentBlock[]`
- 功能模块: 目标轮次驱动（goal-round-driver）—— 同一会话内目标（goal）自动续跑轮次的模型可见提示词
- 调用场景: 每个自动续跑轮次开始时调用，返回一个全新的单块文本提示词，交给 `Agent.followup()` 驱动模型继续工作；该提示词保留在会话历史中。
- 来源分类: 生产代码

## 英文原文
```text
<goal_round>
Objective: ${JSON.stringify(goal.objective)}
Round: ${round}/${goal.maxGoalRounds}

Continue working toward the objective in this same session. Treat the current workspace, tool results, and durable session state as authoritative; inspect them instead of assuming earlier narration is still current. Make concrete progress and verify the result. Before claiming completion, gather evidence that the whole objective is achieved, read the current goal, and mark it complete. If work remains, leave the goal active for the next round. Follow the configured goal-tool policy before reporting a blocker.
</goal_round>
```

## 中文翻译
```text
<goal_round>
目标（Objective）：${JSON.stringify(goal.objective)}
轮次（Round）：${round}/${goal.maxGoalRounds}

请在同一个会话中继续朝着目标推进。将当前的工作区、工具结果和持久化的会话状态视为权威；请检查它们，而不是假设之前的叙述仍然是最新的。取得切实的进展并验证结果。在声称完成之前，收集证明整个目标已实现的证据，读取当前目标，并将其标记为完成。如果仍有工作未完成，请让目标保持激活状态以便进入下一轮。在报告阻塞（blocker）之前，遵循已配置的目标工具策略。
</goal_round>
```

## 关键参数
- `<goal_round>` / `</goal_round>`：包裹标签，保持原样。
- `${JSON.stringify(goal.objective)}`：当前激活目标修订版的客观目标文本（`GoalView.objective`）的 JSON 字符串化形式，运行时插值。
- `${round}/${goal.maxGoalRounds}`：当前轮次号 / 最大轮次上限（`GoalView.maxGoalRounds`）。
- 反引号标识符 `Agent.followup()` 保持原样（调用侧 API）。

## Few-shot 示例
无

## 提示词链路
- 注入时机：作为「fresh one-block prompt for `Agent.followup()`」（源码 JSDoc）在每轮续跑前注入；提示词本身保留在会话历史中（注释：「Render the complete goal-round instruction retained in session history.」）。
- 上游：`goal` —— 正在接纳的精确激活目标修订版（`GoalView`）；`round` —— 下一个正整数轮次号。
- 下游：`Agent.followup()` 把该提示词作为新一轮模型输入；模型按指令推进、验证、读取当前目标并标记完成，或让目标保持激活进入下一轮，或在遵循目标工具策略后报告 blocker。

## 相关代码上下文
- `prompt.ts` 文件头注释：「Model-visible continuation prompt for one same-session goal round.」（同一会话目标轮次的模型可见续跑提示词）。
- 该提示词与 goal 工具（`get_goal` / `update_goal`）配套：明确要求「claiming completion 前收集证据、读取当前目标、标记 complete」，与目标工具语义一致。
