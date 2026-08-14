# 提示词翻译文档：ApprovalPolicyChangeMessage（审批策略变更消息）

## 元信息
- 原文件位置: `packages/interaction/user-approval/src/index.ts:230-236`
- 变量名称: 内联模板（`setPolicy` 方法内）
- 功能模块: `@deepseek-ai/dsh-user-approval` — 审批服务
- 调用场景: 会话运行时审批策略从一种切换为另一种时，经 `agent.inject` 注入一条模型可见的用户角色消息
- 来源分类: 生产代码

## 英文原文
```plaintext
The approval policy changed from "${previous}" to "${policy}" (changed by the user).
```

## 中文翻译
```plaintext
审批策略已从"${previous}"变更为"${policy}"（由用户更改）。
```

## 关键参数
- `${previous}`：变更前的生效策略（`ask` 或 `never`）。
- `${policy}`：变更后的新策略（`ask` 或 `never`）。

## Few-shot 示例
无

## 提示词链路
- 上游: `setPolicy(agent, policy)`（`index.ts:226`）先 `setApprovalPolicy` 写入会话日志，再注入本消息；若 previous === policy 则直接返回不注入。
- 下游: 注入为用户角色消息进入模型历史，告知模型审批策略已变。

## 相关代码上下文
- 方法: `ApprovalService.setPolicy`（`index.ts:226`）。
- 关联: `NEVER_SENTENCE` / `ASK_SENTENCE`（`index.ts:100/102`，`approval:policy` context）。
