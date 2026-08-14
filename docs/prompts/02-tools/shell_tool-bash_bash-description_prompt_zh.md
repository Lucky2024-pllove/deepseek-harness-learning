## 元信息
- 原文件位置: `packages/shell/tool-bash/src/index.ts:70-93`
- 变量名称: `bashDescription(backgroundEnabled, escalationModes)`（模板函数，返回 `bash` 工具的 `description`）
- 功能模块: bash 工具（`ctx.shell` 能力缝的模型面对 Consumer）
- 调用场景: 插件加载时组装 `bash` 工具的完整描述，随工具 schema 进入模型上下文，指导命令执行、沙箱拒绝处理与同回合升级
- 来源分类: 生产代码

## 英文原文

### 组装后的完整提示词（backgroundEnabled = true 且 escalationModes 非空的典型组合）
```
Execute a bash command (`bash -c`) and return its stdout/stderr. Each call runs in a fresh shell: no state (cwd, variables, functions) persists between calls — pass `workdir` instead of using `cd`. Non-zero exits are reported as `[exit code: N]`. Current harness environment facts are exposed through managed `$DSH_*` variables; inspect them when needed. Commands may run under a file sandbox; a blocked file operation is reported as `[sandbox: file access denied under <mode> mode]` — a policy denial, not a bug in the command; do not retry another way. Long output is truncated to its tail; the full output is saved to a file whose path is reported when available. Set `run_in_background: true` for long-running commands: the call returns a job id immediately; read its output with `job_output` and stop it with `job_kill`. Attempting a command the sandbox may deny is safe and expected: run it and read the marker rather than assuming the denial. When a command is denied and a wider mode would let it succeed, escalate immediately in the same turn — the one sanctioned exception to a denial: retry the exact same command once with `sandbox_permissions` (the narrowest wider mode that suffices) plus a one-sentence `justification`. Do not detour through chat to ask permission first — the approval prompt raised by that retry is how the user consents. If the session states approval prompts are disabled, there is no exception: a denial is final — do not set `sandbox_permissions`. Never escalate speculatively: ground the request in a real denial — normally the one this command just hit; escalating up front is fine only when this session already denied the same access. A rejected escalation is final for that command — stop and explain, never work around it — but it does not forbid attempting or escalating other commands later.
```

### 分支变体（源码内）
- background 分支（启用）：`Set \`run_in_background: true\` for long-running commands: the call returns a job id immediately; read its output with \`job_output\` and stop it with \`job_kill\`.`
- background 分支（禁用）：`Background execution is not available; long-running commands must finish within the timeout.`
- 升级段落（escalationModes 非空时追加，见上）；escalationModes 为空时整个升级段落省略（`if (escalationModes.length === 0) return base`）

## 中文翻译

### 组装后的完整提示词（典型组合）
```
执行一条 bash 命令（`bash -c`）并返回其 stdout/stderr。每次调用都在全新的 shell 中运行：调用之间不保留任何状态（cwd、变量、函数）——请传入 `workdir` 而不是使用 `cd`。非零退出码会以 `[exit code: N]` 的形式报告。当前 Harness 环境事实通过受管理的 `$DSH_*` 变量暴露；需要时请检查它们。命令可能在文件沙箱下运行；被阻止的文件操作会报告为 `[sandbox: file access denied under <mode> mode]`——这是策略拒绝，而不是命令本身的缺陷；不要用其他方式重试。长输出会被截断到尾部；完整输出会保存到文件中，路径在可用时会被报告。对于长时间运行的命令，请设置 `run_in_background: true`：调用会立即返回一个作业 id；使用 `job_output` 读取其输出，使用 `job_kill` 停止它。尝试执行沙箱可能拒绝的命令是安全且符合预期的：直接运行并读取标记，而不是臆断拒绝。当命令被拒绝且更宽的模式可以让它成功时，请在同一个回合内立即升级——这是对拒绝的唯一许可例外：使用 `sandbox_permissions`（足以胜任的最窄的更宽模式）外加一句 `justification`，对完全相同的命令重试一次。不要先绕道聊天请求许可——那次重试引发的审批提示就是用户同意的方式。如果会话声明审批提示已被禁用，则不存在例外：拒绝是最终的——不要设置 `sandbox_permissions`。切勿投机性升级：将请求建立在真实的拒绝之上——通常是该命令刚刚遭遇的那一次；仅当本会话已经拒绝了相同的访问时，预先升级才是可以的。被拒绝的升级对该命令是最终的——停下来解释，绝不要绕过它——但这并不禁止以后尝试或升级其他命令。
```

### 分支变体（中文）
- background（启用）：`对于长时间运行的命令，请设置 \`run_in_background: true\`：调用会立即返回一个作业 id；使用 \`job_output\` 读取其输出，使用 \`job_kill\` 停止它。`
- background（禁用）：`后台执行不可用；长时间运行的命令必须在超时时间内完成。`
- 升级段落：仅在存在会限制执行的执行器（escalationModes 非空）时追加；否则省略。

## 关键参数
- `backgroundEnabled: boolean` — 来自 `config.enableRunInBackground`（默认 `true`），决定 background 分支文本；禁用时 `run_in_background` 参数也不对外暴露，且在 execute 中强制拒绝
- `escalationModes: readonly SandboxMode[]` — 来自 `ctx.shell.sandboxMode` 与 `ESCALATION_TARGETS`：无沙箱执行器时为空数组，省略整个升级段落及 `sandbox_permissions`/`justification` 参数
- `$DSH_*` — 由 `DSH_ENV_PREFIX = 'DSH_'`（`packages/subprocess/subprocess/src/types.ts:13`）插值生成的受管理环境变量前缀

## Few-shot 示例
无（该提示词为工具 description；`description` 参数自身的 schema 说明含 `"ls" → "List files in current directory"` 等示例，属于参数描述，不属于本提示词）

## 提示词链路
- 上游: `apply()` 在插件加载时调用 `bashDescription(backgroundEnabled, escalationModes)`（第 244 行），参数来自配置与 shell 能力缝
- 下游: 作为 `bash` 工具的 `description` 注入工具 schema（`ctx.tools.register(defineTool(...))`），随每次工具调用进入模型请求
- 注入时机与 order: 插件加载时；另有 `ctx.systemPrompt.section({ name: 'tool:bash', order: 105, text: 'Check the [exit code: N] marker on every bash result; investigate failures before moving on.' })`（第 236-240 行）作为跨调用补充指导，与本 description 同时生效

## 相关代码上下文
`tool-bash/src/index.ts`：`bashDescription` 定义于第 70-93 行；`validateBashArgs`（第 55-68 行）与 `validateEscalationArgs` 校验参数配对；execute（第 330-390 行）中经 `approveBashEscalation` 在 `ctx.approval` 解析升级请求；`background.ts`/`render.ts` 处理后台作业与结果渲染。
