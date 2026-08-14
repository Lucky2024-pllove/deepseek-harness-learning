## 元信息
- 原文件位置: `packages/todo/tool-todo/src/index.ts:45-78`
- 变量名称: `DESCRIPTION_HEAD` + `DESCRIPTION_PARALLEL`/`DESCRIPTION_SINGLE` + `DESCRIPTION_TAIL`（由 `describe()` 拼接）
- 功能模块: `@deepseek-ai/dsh-tool-todo` — 待办清单工具
- 调用场景: 作为 `todo_write` 工具的 description 注入模型；parallel 分支由配置 `allowParallelInProgress` 决定
- 来源分类: 生产代码

## 英文原文
```plaintext
Record and update a structured task list for the current work. Send the ENTIRE list every call — it REPLACES the previous list (there are no partial updates, no per-item edits). Use it to plan multi-step work and show progress: add one todo per concrete step before you start.

[parallel 分支] Mark every todo being actively worked on `in_progress` — several at once when work genuinely runs in parallel (e.g. concurrent subagents or background commands), one for sequential work; while work remains, at least one task should be `in_progress`.

[single 分支] Keep AT MOST ONE todo `in_progress` at a time; while work remains, exactly one active task should be `in_progress`.

Mark a todo `completed` the moment it is done (do not batch completions), and allow no `in_progress` item only once all work is complete. Skip the list for trivial single-step tasks. Statuses: `pending` (not started), `in_progress` (being worked on now), `completed` (finished).
```

## 中文翻译
```plaintext
记录并更新当前工作的结构化任务清单。每次调用都发送完整清单——它会替换先前的清单（没有部分更新，也没有逐项编辑）。用它来规划多步工作并展示进度：开始前，为每个具体步骤添加一条待办。

[parallel 分支] 将每个正在积极处理的任务标记为 `in_progress` —— 当工作确实并行运行（例如并发子智能体或后台命令）时，可同时标记多个；顺序工作时标记一个；只要还有工作未完成，至少应有一个任务处于 `in_progress`。

[single 分支] 同一时间最多保持一个待办为 `in_progress`；只要还有工作未完成，就应恰好有一个活跃任务处于 `in_progress`。

任务完成的瞬间就标记为 `completed`（不要批量完成），只有全部工作完成后才允许没有任何 `in_progress` 项。对于琐碎的单步任务，跳过该清单。状态：`pending`（未开始）、`in_progress`（正在处理）、`completed`（已完成）。
```

## 关键参数
- `allowParallelInProgress`（config）：决定拼接 `DESCRIPTION_PARALLEL` 还是 `DESCRIPTION_SINGLE`。

## Few-shot 示例
无

## 提示词链路
- 上游: `describe(allowParallel)`（`index.ts:74`）拼接三段常量，作为 `todo_write` 工具的 description。
- 下游: 作为工具 Schema 的 description 注入模型，指导 todo_write 的整表替换语义与 in_progress 并行纪律。

## 相关代码上下文
- 常量: `DESCRIPTION_HEAD`（`index.ts:45`）、`DESCRIPTION_PARALLEL`（`index.ts:51`）、`DESCRIPTION_SINGLE`（`index.ts:57`）、`DESCRIPTION_TAIL`（`index.ts:61`）。
- 函数: `describe(allowParallel)`（`index.ts:74`）。
