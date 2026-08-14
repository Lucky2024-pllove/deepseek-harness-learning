## 元信息
- 原文件位置: `packages/subagent/subagent/src/child-agent.ts:135-139`
- 变量名称: `SUBAGENT_DELEGATION_CONTEXT`
- 功能模块: 子代理委派（subagent delegation）—— 为每个进程内子代理（child agent）注入的委派作用域陈述
- 调用场景: 在子代理的创建窗口内，`applyChildComposition` 为每个子代理注册该固定陈述；冷启动恢复（cold resume）同样经过此路径。它属于运行时上下文贡献而非系统提示词片段，从而保证部署级系统提示词在父代理与子代理间保持一致。
- 来源分类: 生产代码

## 英文原文
```text
You are a delegated subagent: your permission scope was fixed when you were started and cannot be widened from inside this session — operations that require approval are rejected automatically. When the task needs access beyond that scope, do not retry the denied operation; state the limitation in your reply so the delegating agent can handle it.
```

## 中文翻译
```text
你是一个被委派的子代理（subagent）：你的权限范围在启动时即已固定，无法在本会话内部扩大 —— 需要审批的操作会被自动拒绝。当任务需要超出该范围的访问权限时，不要重试被拒绝的操作；请在回复中说明这一限制，以便委派你的代理（delegating agent）来处理。
```

## 关键参数
- 无动态占位符；该陈述为固定字符串常量（由三个字符串字面量拼接而成）。
- 语义要点：子代理权限范围在委派边界固定（`DelegatedPolicyOverrides`：沙箱模式继承父会话、审批策略固定为 `'never'`），会话内无法扩大；拒绝操作不得重试，必须把限制上报给委派方。

## Few-shot 示例
无

## 提示词链路
- 注入时机 / order：`applyChildComposition`（`child-agent.ts:163-175`）中 `childCtx.systemPrompt.context({ name: 'subagent:delegation', order: 120, text: SUBAGENT_DELEGATION_CONTEXT })`（第 170 行）；order 120 位于 `sandbox:policy`（110）与 `approval:policy`（115）之后。注释明确「Order 120: after the sandbox:policy (110) and approval:policy (115) sentences」。
- 上游：无输入依赖；任何 `childCtx`（子代理作用域）创建即注册。
- 下游：该注册属于子代理作用域，对父代理与兄弟代理不可见；随后按需应用子代理自身的 persona 遮蔽段落（`deployment:persona`，order 0）与工具限制（`ctx.tools.restrict`）。
- 组合顺序：先 `composeFrom(childCtx, parent.ctx)` 加入父代理预设，再注册子代理自身内容 —— 最近的 scope 在同名时胜出，子级限制与整条链允许的集合取交集。

## 相关代码上下文
- `applyChildComposition(childCtx, parent, composition)` 同时承载 join 与子级注册（`index` 注释：缺少 join 的子代理会看到空工具注册表与父提示词片段缺失，以参数化父代理使该缺陷在调用点不可表示）。
- 委派边界策略：`DelegatedPolicyOverrides`（`child-agent.ts:178-187`）在子会话日志上播种 —— 沙箱模式取父会话显式覆盖，审批策略只要组合了审批能力即为 `'never'`（子代理只在其固定沙箱作用域内行动）。
