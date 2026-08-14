## 元信息
- 原文件位置: `packages/workflow/tool-workflow/src/index.ts:138-150`
- 变量名称: `DESCRIPTION`
- 功能模块: `@deepseek-ai/dsh-tool-workflow` — 工作流编排工具
- 调用场景: 作为 `workflow` 工具的 description 注入模型（模型看到完整脚本编写契约）
- 来源分类: 生产代码

## 英文原文
```plaintext
Run a JavaScript workflow script that orchestrates subagents at scale. Use this for work that fans out across many independent pieces — an audit over many files, a migration, multi-angle research, adversarial verification of findings — where you write the orchestration as a script instead of delegating turn by turn.

The workflow's identity rides the `meta` parameter as JSON: required `name` (short kebab-case) and `description` strings, optional `whenToUse` string and `phases` array (`{title, detail?, provider?, model?}`). The `script` parameter is the plain JavaScript body ONLY (NOT TypeScript, and NO `export const meta` statement — meta is a parameter, not code), running with top-level await; end with `return <value>` — the value must be JSON-serializable and is this tool's result.

Script-body hooks:
- `agent(prompt, opts?): Promise<any>` — run one subagent to completion. Without `opts.schema` it resolves to the child's final text; with `opts.schema` (an object-rooted JSON Schema using ONLY type/properties/required/additionalProperties/items/enum/const/oneOf — no pattern/format/numeric bounds) it resolves to the validated object. Resolves `null` when the child fails (filter with `.filter(Boolean)`). Other opts: `label` (display), `phase` (progress group), and independent `provider`/`model` LLM target overrides (either may be provided alone). Anything else (`effort`/`isolation`/`agentType`) is rejected loudly.
- `pipeline(items, ...stages): Promise<any[]>` — run each item through the stages independently with NO barrier between stages (prefer this for multi-stage work). Each stage receives `(prev, item, index)`. An ordinary stage throw drops that ITEM to `null` and skips its remaining stages.
- `parallel(thunks): Promise<any[]>` — run zero-argument functions concurrently and await ALL of them (a barrier; use only when a stage genuinely needs every prior result together). A throwing thunk resolves to `null`.
- `phase(title)` — start a progress phase; `log(message)` — narrate progress; `args` — the tool call's `args` input, verbatim.

Misused hooks (bad arguments, unknown options, unsupported schemas, tripped caps) throw errors that ALWAYS kill the script — they never dissolve into a per-item `null`.

Constraints: concurrency and total-agent caps apply; no filesystem, network, timers, or Node.js APIs are provided — the agents do the work, the script only coordinates them. The run executes in the foreground: this call returns when the whole script finishes.
```

## 中文翻译
```plaintext
运行一个 JavaScript 工作流脚本，规模化编排子智能体。当工作扇出到许多相互独立的部分——对大量文件的审计、一次迁移、多角度研究、对发现结果的对抗式验证——而你以脚本形式编写编排逻辑、而非逐轮委派时，使用本工具。

工作流的身份以 `meta` 参数（JSON）承载：必需的 `name`（短 kebab-case）与 `description` 字符串，可选的 `whenToUse` 字符串与 `phases` 数组（`{title, detail?, provider?, model?}`）。`script` 参数仅为纯 JavaScript 主体（不是 TypeScript，且没有 `export const meta` 语句——meta 是参数而非代码），以顶层 await 运行；以 `return <value>` 结尾——该值必须可 JSON 序列化，并作为本工具的结果。

脚本主体钩子：
- `agent(prompt, opts?): Promise<any>` — 运行一个子智能体直到完成。不带 `opts.schema` 时，resolve 为子智能体的最终文本；带 `opts.schema`（一个以对象为根的 JSON Schema，只使用 type/properties/required/additionalProperties/items/enum/const/oneOf——不使用 pattern/format/数值边界）时，resolve 为校验后的对象。子智能体失败时 resolve 为 `null`（用 `.filter(Boolean)` 过滤）。其他 opts：`label`（显示）、`phase`（进度组），以及独立的 `provider`/`model` LLM 目标覆盖（两者可单独提供）。其他任何项（`effort`/`isolation`/`agentType`）都会被响亮地拒绝。
- `pipeline(items, ...stages): Promise<any[]>` — 让每个条目独立流经各阶段，阶段之间无屏障（多阶段工作优先使用）。每个阶段接收 `(prev, item, index)`。普通阶段抛错会把该 ITEM 降为 `null` 并跳过其剩余阶段。
- `parallel(thunks): Promise<any[]>` — 并发运行零参函数并 await 全部（一个屏障；仅当某阶段确实需要所有先前结果一起时才使用）。抛错的 thunk resolve 为 `null`。
- `phase(title)` — 启动一个进度阶段；`log(message)` — 叙述进度；`args` — 工具调用的 `args` 输入，原样。

误用的钩子（错误参数、未知选项、不支持的 schema、触及上限）抛错并总是杀死脚本——它们永远不会消解为逐项的 `null`。

约束：并发与总智能体上限生效；不提供文件系统、网络、定时器或 Node.js API——智能体做实际工作，脚本只负责协调。运行在前台执行：本调用在整个脚本结束时才返回。
```

## 关键参数
- `meta.name` / `meta.description` / `meta.phases` / `meta.whenToUse`：工作流身份块字段。
- `script`：纯 JS 脚本主体（顶层 await、`return <value>`）。
- 钩子: `agent` / `pipeline` / `parallel` / `phase` / `log` / `args`。

## Few-shot 示例
无

## 提示词链路
- 上游: `defineTool({ name: toolName, description: DESCRIPTION, ... })`（`index.ts:217`）把本规范作为 workflow 工具的 description。
- 下游: 作为工具 Schema 的 description 注入模型，与 `tool:workflow` section（order 115）配套。

## 相关代码上下文
- 常量: `DESCRIPTION`（`index.ts:138`）。
- 关联: `tool:workflow` section（`index.ts:212`）、worker-thread 引擎。
