## 元信息
- 原文件位置: `packages/interaction/tool-ask-user/src/index.ts:16-17`
- 变量名称: `description`（常量）
- 功能模块: `@deepseek-ai/dsh-tool-ask-user` — 用户提问工具
- 调用场景: 作为 `ask_user_question` 工具的 description 注入模型
- 来源分类: 生产代码

## 英文原文
```plaintext
Ask the user a concise question when you need confirmation, a choice, or missing information before proceeding. Send one or more questions, each with a stable id that will be echoed in the answer.
```

## 中文翻译
```plaintext
当你需要确认、做出选择，或在继续之前缺少信息时，向用户提出一个简洁的问题。发送一个或多个问题，每个问题带有一个稳定的 id，该 id 会在回答中回显。
```

## 关键参数
- `questions` 参数（数组）：每个问题含 `id`（稳定 id，回答中回显）、`question`（具体问题）、`header`（可选短标题）、`options`（可选选项，推荐项放首位并标注 "(Recommended)"）。

## Few-shot 示例
无

## 提示词链路
- 上游: `apply()`（`index.ts:19`）注册 `ask_user_question` 工具，description 见 16-17 行。
- 下游: 作为工具 Schema 的 description 注入模型，工具暂停直到 UI provider 返回人类答案。

## 相关代码上下文
- 关联: `userQuestions` 服务（`@deepseek-ai/dsh-user-questions`）、`DELEGATED_CALLER_ERROR`（子代理限制）。
