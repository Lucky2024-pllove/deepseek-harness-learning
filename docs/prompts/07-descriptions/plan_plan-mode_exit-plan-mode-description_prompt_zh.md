# 提示词翻译文档：EXIT_DESCRIPTION（exit_plan_mode 工具描述）

## 元信息
- 原文件位置: `packages/plan/plan-mode/src/index.ts:84-88`
- 变量名称: `EXIT_DESCRIPTION`
- 功能模块: `@deepseek-ai/dsh-plan-mode` — 计划模式（plan mode）
- 调用场景: 作为 `exit_plan_mode` 工具的 description 注入模型（仅在计划模式可用）
- 来源分类: 生产代码

## 英文原文
```plaintext
Use only in plan mode. Present your plan for the user's review and, on approval, leave plan mode. Send the COMPLETE plan as markdown, starting with a # heading that names it. The user may approve (carry out the plan from your next step) or keep planning — their feedback comes back in the tool result; revise and present again.
```

## 中文翻译
```plaintext
仅在计划模式使用。将你的计划提交给用户审阅，并在批准后离开计划模式。以 markdown 形式发送完整计划，以一个命名它的 # 标题开头。用户可以批准（从你的下一步开始执行计划）或继续规划——他们的反馈会随工具结果返回；据此修订并再次提交。
```

## 关键参数
- 无占位符。计划正文以 markdown 提供，须以 `#` 标题开头。

## Few-shot 示例
无

## 提示词链路
- 上游: `plan-mode` 插件注册 `exit_plan_mode` 工具，本描述作为其 description。
- 下游: 模型在计划模式下调用该工具提交计划，用户批准后离开计划模式。

## 相关代码上下文
- 常量: `EXIT_DESCRIPTION`（`index.ts:84`）。
- 关联: `plan:policy` section（正文来自部署配置 `section`，无固定文本）。
