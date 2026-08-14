# 提示词翻译文档

## 元信息
- 原文件位置: `packages/shell/tool-pwsh/src/index.ts:103-145`
- 变量名称: `pwshDescription(backgroundEnabled, escalationModes)`（模板函数，返回 `pwsh` 工具的 `description`）
- 功能模块: pwsh 工具（`ctx.shell` 能力缝的模型面对 PowerShell Consumer，面向 Windows 组合）
- 调用场景: 插件加载时组装 `pwsh` 工具的完整描述，随工具 schema 进入模型上下文；除 bash 通用契约外，额外说明 Windows 沙箱的受限语言模式与命名管道 EPERM 边界
- 来源分类: 生产代码

## 英文原文

### 组装后的完整提示词（backgroundEnabled = true 且 escalationModes 非空的典型组合）
```
Execute a PowerShell command (`pwsh -Command`) and return its stdout/stderr. Each call runs in a fresh pwsh process: no state (cwd, variables, functions) persists between calls — pass `workdir` instead of using `cd`. Paths use native Windows form (`C:\...`); read environment variables with `$env:NAME`. Non-zero exits are reported as `[exit code: N]`. Current harness environment facts are exposed through managed `$env:DSH_*` variables; inspect them when needed. Commands may run under a file sandbox; a blocked file operation is reported as `[sandbox: file access denied under <mode> mode]` — a policy denial, not a bug in the command; do not retry another way. Long output is truncated to its tail; the full output is saved to a file whose path is reported when available. On Windows a force-killed command settles as `[exit code: 1]` without a signal marker — treat it as an interruption, not a command failure. Set `run_in_background: true` for long-running commands: the call returns a job id immediately; read its output with `job_output` and stop it with `job_kill`. Under the Windows sandbox, read-only pwsh runs in PowerShell ConstrainedLanguage mode, while workspace-write stays in FullLanguage unless host policy says otherwise. In read-only, prefer cmdlets and core types (`[string]`, `[datetime]`, `[regex]`, `[guid]`); .NET static calls (`[System.IO.*]::`, `[math]::`), `Add-Type`, COM objects, and reflection fail with "only core types" errors. `-f` formatting, property access, and core cmdlets work. In both confined modes, programs cannot open named pipes, so a command that captures another program's output through piped stdio (Node.js `child_process.spawn`/`exec` with the default `stdio: 'pipe'`) fails with EPERM, while `stdio: 'inherit'` and `stdio: 'ignore'` spawns work and PowerShell's own pipelines are unaffected. That EPERM is the documented boundary: do not retry the command another way — escalate the exact command once or restructure it to avoid capturing output. Attempting a command the sandbox may deny is safe and expected: run it and read the marker rather than assuming the denial. When a command is denied and a wider mode would let it succeed, escalate immediately in the same turn — the one sanctioned exception to a denial: retry the exact same command once with `sandbox_permissions` (the narrowest wider mode that suffices) plus a one-sentence `justification`. Do not detour through chat to ask permission first — the approval prompt raised by that retry is how the user consents. If the session states approval prompts are disabled, there is no exception: a denial is final — do not set `sandbox_permissions`. Never escalate speculatively: ground the request in a real denial — normally the one this command just hit; escalating up front is fine only when this session already denied the same access. A rejected escalation is final for that command — stop and explain, never work around it — but it does not forbid attempting or escalating other commands later.
```

### 分支变体（源码内）
- background 分支（启用/禁用）与 bash 相同；escalationModes 为空时省略升级段落
- Windows 受限令牌段落（ConstrainedLanguage / 命名管道 EPERM）仅在 escalationModes 非空时追加（源码注释说明：当前所有配套受限执行器的 tool-pwsh 组合均为 win32，若未来出现 POSIX pwsh 沙箱组合，需改为按平台门控）

## 中文翻译

### 组装后的完整提示词（典型组合）
```
执行一条 PowerShell 命令（`pwsh -Command`）并返回其 stdout/stderr。每次调用都在全新的 pwsh 进程中运行：调用之间不保留任何状态（cwd、变量、函数）——请传入 `workdir` 而不是使用 `cd`。路径使用 Windows 原生形式（`C:\...`）；使用 `$env:NAME` 读取环境变量。非零退出码会以 `[exit code: N]` 的形式报告。当前 Harness 环境事实通过受管理的 `$env:DSH_*` 变量暴露；需要时请检查它们。命令可能在文件沙箱下运行；被阻止的文件操作会报告为 `[sandbox: file access denied under <mode> mode]`——这是策略拒绝，而不是命令本身的缺陷；不要用其他方式重试。长输出会被截断到尾部；完整输出会保存到文件中，路径在可用时会被报告。在 Windows 上，被强制终止的命令以 `[exit code: 1]` 结束且没有信号标记——请将其视为中断，而不是命令失败。对于长时间运行的命令，请设置 `run_in_background: true`：调用会立即返回一个作业 id；使用 `job_output` 读取其输出，使用 `job_kill` 停止它。在 Windows 沙箱下，只读的 pwsh 以 PowerShell 受限语言模式（ConstrainedLanguage）运行，而 workspace-write 保持完整语言模式（FullLanguage），除非宿主策略另有规定。在只读模式下，优先使用 cmdlet 和核心类型（`[string]`、`[datetime]`、`[regex]`、`[guid]`）；.NET 静态调用（`[System.IO.*]::`、`[math]::`）、`Add-Type`、COM 对象和反射会以 "only core types" 错误失败。`-f` 格式化、属性访问和核心 cmdlet 可用。在两种受限模式下，程序都无法打开命名管道，因此通过管道 stdio 捕获另一个程序输出的命令（Node.js `child_process.spawn`/`exec` 使用默认 `stdio: 'pipe'`）会以 EPERM 失败，而 `stdio: 'inherit'` 和 `stdio: 'ignore'` 的 spawn 可以工作，PowerShell 自身的管道不受影响。该 EPERM 是文档化的边界：不要用其他方式重试该命令——要么对完全相同的命令升级一次，要么重构以避免捕获输出。尝试执行沙箱可能拒绝的命令是安全且符合预期的：直接运行并读取标记，而不是臆断拒绝。当命令被拒绝且更宽的模式可以让它成功时，请在同一个回合内立即升级——这是对拒绝的唯一许可例外：使用 `sandbox_permissions`（足以胜任的最窄的更宽模式）外加一句 `justification`，对完全相同的命令重试一次。不要先绕道聊天请求许可——那次重试引发的审批提示就是用户同意的方式。如果会话声明审批提示已被禁用，则不存在例外：拒绝是最终的——不要设置 `sandbox_permissions`。切勿投机性升级：将请求建立在真实的拒绝之上——通常是该命令刚刚遭遇的那一次；仅当本会话已经拒绝了相同的访问时，预先升级才是可以的。被拒绝的升级对该命令是最终的——停下来解释，绝不要绕过它——但这并不禁止以后尝试或升级其他命令。
```

## 关键参数
- `backgroundEnabled: boolean` — 来自 `config.enableRunInBackground`（默认 `true`），决定 background 分支文本
- `escalationModes: readonly SandboxMode[]` — 来自 `ctx.shell.sandboxMode` 与 `ESCALATION_TARGETS`；为空时省略升级段落与 Windows 受限令牌段落，且不暴露 `sandbox_permissions`/`justification` 参数
- `$env:DSH_*` — 受管理的 DSH 环境变量（前缀 `DSH_`，见 `packages/subprocess/subprocess/src/types.ts:13`）

## Few-shot 示例
无（`description` 参数自身的 schema 说明含 `"ls" → "List files in current directory"`、`"Get-Process" → "List running processes"` 等示例，属于参数描述，不属于本提示词）

## 提示词链路
- 上游: `apply()` 在插件加载时调用 `pwshDescription(backgroundEnabled, escalationModes)`（第 254 行）
- 下游: 作为 `pwsh` 工具的 `description` 注入工具 schema，随每次工具调用进入模型请求
- 注入时机与 order: 插件加载时；另有 `ctx.systemPrompt.section({ name: 'tool:pwsh', order: 105, ... })`（第 245-250 行）补充非零退出/强制终止标记的跨调用指导。行为与 dsh-tool-bash 逐调用对齐（镜像设计，见文件头注释）

## 相关代码上下文
`tool-pwsh/src/index.ts`：`pwshDescription` 定义于第 103-145 行；`validatePwshArgs`（第 87-100 行）、`approvePwshEscalation`（第 222-242 行）与 bash 镜像；execute（第 348-407 行）处理前台/后台与沙箱升级；`render.ts` 提供 pwsh 结果渲染。Windows 沙箱语言模式与命名管道契约注释于第 117-123 行。
