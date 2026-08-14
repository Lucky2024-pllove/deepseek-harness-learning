## 元信息
- 原文件位置: `packages/interaction/user-approval/src/index.ts:100-102`
- 变量名称: `NEVER_SENTENCE`（第 100 行）、`ASK_SENTENCE`（第 102 行）
- 功能模块: 用户审批 / 交互（user-approval）—— 会话级审批策略（`ApprovalPolicy = 'ask' | 'never'`）的模型可见陈述
- 调用场景: 每次 agent 请求前，`ApprovalService` 把当前生效的审批策略渲染为运行时上下文快照片段；`'never'` 策略输出 `NEVER_SENTENCE`，其余（`'ask'`）输出 `ASK_SENTENCE`。无会话的裸 `assemble()`（测试、诊断）输出空字符串。
- 来源分类: 生产代码

> 说明：两个句子合并为一份文档，分别标注。

## 英文原文

### NEVER_SENTENCE（`index.ts:100`）
```text
Approval prompts are disabled in this session: actions that require approval are rejected automatically — do not request sandbox escalation (do not set `sandbox_permissions`).
```

### ASK_SENTENCE（`index.ts:102`）
```text
Approval policy: ask. Operations that require approval may ask through the configured answerers; without an available answerer, the request fails closed.
```

## 中文翻译

### NEVER_SENTENCE
```text
本会话已禁用审批提示：需要审批的操作会被自动拒绝 —— 不要请求沙箱提权（不要设置 `sandbox_permissions`）。
```

### ASK_SENTENCE
```text
审批策略：ask（询问）。需要审批的操作可以通过已配置的应答者（answerer）发起询问；若没有可用的应答者，请求将失败关闭（fails closed）。
```

## 关键参数
- 反引号标识符 `sandbox_permissions` 保持原样（工具参数名，不做翻译）。
- 审批策略来源：`effectiveApprovalPolicy(session)` —— 会话日志中最后一次 `approval/policy` 事件的 `data.policy`；无切换事件时回退到插件配置默认 `'ask'`（`Config.policy` 默认值）。
- `'ask'` / `'never'` 为 `ApprovalPolicy` 联合类型字面量；`'never'` 是严格的 headless 姿态（CI、无人值守运行），其结果是无需询问即可预知的确定性拒绝。

## Few-shot 示例
无

## 提示词链路
- 注入时机 / order：通过 `ctx.inject(['systemPrompt'], ...)` 中 `scope.systemPrompt.context({ name: 'approval:policy', order: 115, text: (context) => ... })` 注册（`index.ts:204-216`）；order 115 位于 `sandbox:policy`（110）之后、`subagent:delegation`（120）之前。
- 上游：`ApprovalService.effectivePolicy(agent.session)` 折叠出的当前策略；`text` 回调在 `agent === undefined` 时返回 `''`。
- 下游：渲染文本进入每次 agent 请求前的运行时上下文快照，随模型历史记录持久化，回放可重建相同策略。策略切换通过 `setApprovalPolicy` 追加 `approval/policy` 事件，不重写稳定系统提示词的缓存前缀。

## 相关代码上下文
- `setApprovalPolicy`（`index.ts:142-147`）在日志变更前校验策略值，非法值抛出 `TypeError`。
- 两条句子的设计意图（注释 `index.ts:84-93`）：`'ask'` 委托给已组合的应答者，无应答者时链路落入失败关闭的 `'unavailable'`；`'never'` 永不提示任何人，每个 ask 确定性解析为 `'rejected'`。
