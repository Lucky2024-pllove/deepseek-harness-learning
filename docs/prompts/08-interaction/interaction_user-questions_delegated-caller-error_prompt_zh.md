# 提示词翻译文档：DELEGATED_CALLER_ERROR（子代理人类交互不可用错误）

## 元信息
- 原文件位置: `packages/interaction/user-questions/src/index.ts:107-111`
- 变量名称: 内联错误文本（`UserQuestionError` 构造）
- 功能模块: `@deepseek-ai/dsh-user-questions` — 用户提问服务
- 调用场景: 当调用 ask_user_question 的 agent 被另一个活跃 agent 拥有（即它是子代理）时，抛出的模型可见错误反馈
- 来源分类: 生产代码

## 英文原文
```plaintext
human interaction is unavailable while the calling agent is owned by another live agent; include the unresolved question or decision in the child agent's final result
```

## 中文翻译
```plaintext
当调用方智能体被另一个活跃智能体拥有时，人类交互不可用；请把未解决的问题或决策写入子智能体的最终结果中。
```

## 关键参数
- 无占位符。错误码 `DELEGATED_CALLER`。

## Few-shot 示例
无

## 提示词链路
- 上游: `request()`（`index.ts`）检查 `agents.roots().includes(agent)`，非根 agent（子代理）时抛本错误。
- 下游: 作为工具错误结果反馈给模型，指示子代理把问题写进最终结果而非尝试直接向用户提问。

## 相关代码上下文
- 关联: `ask_user_question` 工具（`tool-ask-user/src/index.ts`）。
- 机制: 子代理不能直接与用户交互，未决问题应通过 report/最终结果回传给父代理。
