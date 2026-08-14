# 提示词翻译文档

## 元信息
- 原文件位置: `packages/workflow/tool-ralph/src/index.ts:155-162`
- 变量名称: `prompt`（`RALPH_SCRIPT` 内部，`String.raw` 模板中的 `prompt` 数组，`join('\n\n')` 后作为子代理提示词）
- 功能模块: Ralph 循环工具（tool-ralph）—— 面向一个不可变目标的前台全新代理循环（fresh-agent loop）
- 调用场景: `RALPH_SCRIPT` 是部署所有的固定编排脚本（模型只提供数据，不能改变循环、路由、schema 或交接校验），在 worker 中执行；`for (round = 1; round <= args.maxRounds; round++)` 每轮构造该提示词并调用 `agent(prompt, { label, phase, schema: reportSchema })` 启动一个全新子代理。
- 来源分类: 生产代码

## 英文原文
```text
You are one fresh worker in a foreground Ralph loop. You receive no parent conversation and no prior child session. Do not call the ralph tool: this round already is its worker.

Immutable objective:
${args.objective}

Ralph round: ${round} of ${args.maxRounds}.

The shared workspace and its current working tree are the long-term memory and source of truth. Inspect them before acting, preserve existing work, perform concrete in-scope work, and verify what you change. Treat the previous report only as a bounded handoff; confirm it against the workspace.

Previous structured handoff:
${prior}

Return one report with exact normalized strings. Use status continue with at least one nextSteps entry while useful work remains; complete only with concrete evidence and no nextSteps; blocked only when no meaningful progress is possible without human input or an external-state change. blocker must be empty unless blocked.
```

## 中文翻译
```text
你是前台 Ralph 循环（Ralph loop）中的一个全新工作者（fresh worker）。你不会收到父对话，也没有之前的子会话。不要调用 ralph 工具：本轮已经是它的工作者。

不可变目标（Immutable objective）：
${args.objective}

Ralph 轮次：${round} / ${args.maxRounds}。

共享工作区及其当前工作树是长期记忆和事实来源（source of truth）。在行动之前检查它们，保留已有的工作，执行具体的、范围内的工作，并验证你所做的更改。只把上一份报告当作一个有界的交接（bounded handoff）；对照工作区确认它。

上一份结构化交接（Previous structured handoff）：
${prior}

返回一份使用精确归一化字符串的报告。当仍有有用的工作要做时，使用状态 continue 并至少携带一条 nextSteps；只有具备具体证据且没有 nextSteps 时才使用 complete；只有在没有人工输入或外部状态变化就无法取得有意义进展时，才使用 blocked。除非处于 blocked 状态，否则 blocker 必须为空。
```

## 关键参数
- `${args.objective}`：不可变目标（`RalphCallArgs.objective`，工具参数）。
- `${round}` / `${args.maxRounds}`：当前轮次号与最大轮次上限（`RalphCallArgs.maxRounds`，默认 256）。
- `${prior}`：上一份结构化报告（`previous`）的 JSON 字符串化结果；首轮为 `'(none — this is the first round)'`。
- `reportSchema`（`RALPH_SCRIPT` 第 91-102 行）：结构化报告 schema —— `{ status: 'continue'|'complete'|'blocked', summary, evidence[], nextSteps[], blocker }`，`additionalProperties: false`；子代理输出经 `validateReport` 严格校验（归一化、非空、状态约束、`maxHandoffChars` 上限）。
- 反引号标识符 `ralph` 工具名保持原样。

## Few-shot 示例
无（`reportSchema` 为 JSON Schema 结构约束，非 few-shot 示例）

## 提示词链路
- 注入时机：`RALPH_SCRIPT` 由 `tool-ralph` 插件在 worker 线程中执行（部署所有，模型不可改）；每轮 `prompt` 数组 `join('\n\n')` 后传入 `agent(prompt, { label: 'Ralph round N', phase: 'Fresh-agent rounds', schema: reportSchema })`，启动一个无父对话、无先前子会话的全新子代理。
- 上游：`args.objective`（工具参数）、`args.maxRounds`（工具参数/默认 256）、`previous`（上一轮 `validateReport` 通过的报告，首轮为 none 标记）。
- 下游：子代理返回的原始报告 → `validateReport`（校验失败抛错终止该轮，`agent` 返回 null 时以 `round-failed` 终止）→ `status === 'complete'` 终止并返回报告；`'blocked'` 以阻塞终止；否则 `previous = report` 进入下一轮；到达轮次上限以 `budget-limited` 终止。
- 循环语义：每轮全新子代理、共享工作区为长期记忆、仅结构化报告跨越轮次（与工具 DESCRIPTION 一致）。

## 相关代码上下文
- `RALPH_SCRIPT` 定义于 `tool-ralph/src/index.ts:90+`，使用 `String.raw`（`${...}` 插值仍生效，反斜杠不做转义）。
- 工具只应由直接人类显式要求 Ralph/全新代理迭代时使用（DESCRIPTION 明确「Ordinary long-running same-session work belongs to goal tools.」）。
