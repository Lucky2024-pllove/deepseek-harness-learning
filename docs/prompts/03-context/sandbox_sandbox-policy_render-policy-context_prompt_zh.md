# 提示词翻译文档

## 元信息
- 原文件位置: `packages/sandbox/sandbox-policy/src/index.ts:38-52`
- 变量名称: `renderPolicyContext(policy: SandboxExecutionPolicy)`（内部函数，按 `policy.mode` 分支返回三个变体：`read-only` / `workspace-write` / `danger-full-access`）
- 功能模块: 沙箱策略（sandbox-policy）—— 会话文件沙箱模式的唯一策略归属地（`ctx.sandboxPolicy`）
- 调用场景: 每次 agent 请求前，策略归属者把解析后的策略贡献进缓存安全的运行时上下文快照（runtime-context snapshot）；代理循环将该快照作为模型历史记录，因此回放（replay）能重建出与执行消费者相同的模式与根目录。`renderPolicyContext` 只描述策略、不盘点能力清单。
- 来源分类: 生产代码

> 说明：三个模式变体合并为一份文档，下面分别标注。

## 英文原文

### 变体 1：read-only（`index.ts:41`）
```text
Current DSH file policy: read-only. Any available operation enforced by the DSH file sandbox cannot modify files in the standing mode. Do not refuse a required modification from this policy alone: try an available tool normally and follow any denial and escalation guidance it returns.
```

### 变体 2：workspace-write（`index.ts:42-43`）
```text
Current DSH file policy: workspace-write. Any available operation enforced by the DSH file sandbox may modify files under the session workspace: ${JSON.stringify(policy.workspaceRoot)}. Some platform temporary areas may also be writable.
```

### 变体 3：danger-full-access（`index.ts:44-45`）
```text
Current DSH file policy: danger-full-access. The DSH file sandbox does not restrict file modifications by available operations.
```

## 中文翻译

### 变体 1：read-only
```text
当前 DSH 文件策略：只读（read-only）。在当前模式下，由 DSH 文件沙箱执行的所有可用操作都无法修改文件。不要仅因这一策略而拒绝必要的修改：请正常尝试可用的工具，并遵循其返回的拒绝与提权（escalation）指引。
```

### 变体 2：workspace-write
```text
当前 DSH 文件策略：工作区可写（workspace-write）。由 DSH 文件沙箱执行的所有可用操作，可以修改会话工作区（${JSON.stringify(policy.workspaceRoot)}）下的文件。部分平台临时区域也可能是可写的。
```

### 变体 3：danger-full-access
```text
当前 DSH 文件策略：危险全权限（danger-full-access）。DSH 文件沙箱不限制可用操作对文件的修改。
```

## 关键参数
- `${JSON.stringify(policy.workspaceRoot)}`：workspace-write 模式下注入的工作区根目录（绝对路径）的 JSON 字符串化形式。来源：`resolve()` 解析出的 `policy.workspaceRoot` —— 优先取会话 `header.cwd`，无会话或无边界的调用回退到部署配置的 `workspaceRoot`（默认 `process.cwd()`）。
- `policy.mode`：本次调用的解析后沙箱模式，优先级为「已批准的显式覆盖 > 会话最后一次 `sandbox/mode` 事件 > 部署默认（默认 `read-only`）」。
- 反引号标识符 `read-only` / `workspace-write` / `danger-full-access` 为 `SandboxMode` 联合类型的字面量，保持原样。

## Few-shot 示例
无

## 提示词链路
- 注入时机 / order：通过 `ctx.systemPrompt.context({ name: 'sandbox:policy', order: 110, text: ... })` 注册（`index.ts:112-123`），是运行时上下文（runtime context）片段，而非稳定系统提示词的一部分；order 110 位于 `approval:policy`（115）与 `subagent:delegation`（120）之前。
- 上游：`SandboxPolicyService.resolve({ session, mode })` 解析出的 `SandboxExecutionPolicy`；`text` 回调在无会话时返回空字符串（`session === undefined ? '' : renderPolicyContext(...)`）。
- 下游：渲染文本进入每次 agent 请求前的运行时上下文快照，随模型历史记录持久化；文件系统、一次性 bash、终端等执行后端读取同一份已解析策略进行强制。

## 相关代码上下文
- 函数 `renderPolicyContext` 是模块内的纯渲染函数；`switch (policy.mode)` 覆盖三个分支，`default` 分支仅作为 `SandboxMode` 封闭联合的静态穷尽性守卫（`const mode: never = policy.mode; throw ...`）。
- 服务构造函数中 `ctx.inject(['systemPrompt'], ...)` 注册上下文贡献；注释明确「上下文不盘点能力，各后端保留自己的强制方言，各工具拥有自己的拒绝与提级指引」。
