## 元信息
- 原文件位置: `packages/subagent/subagent-in-process-driver/src/structured.ts:26-29`
- 变量名称: `STRUCTURED_OUTPUT_INSTRUCTION`
- 功能模块: `@deepseek-ai/dsh-subagent-in-process-driver` — 进程内子代理驱动的结构化输出运行时
- 调用场景: 注册为子代理的尾部（order-190，工具指导带末尾）作用域提示词 section；要求子代理以 `structured_output` 工具调用作为最终结果
- 来源分类: 生产代码

## 英文原文
```plaintext
When you have your final answer, you MUST report it by calling the `structured_output` tool with arguments matching its parameter schema exactly. Do not finish with a plain text answer: only the tool call counts as your result.
```

## 中文翻译
```plaintext
当你得到最终答案时，必须通过调用 `structured_output` 工具来报告它，且参数必须与其参数 schema 精确匹配。不要以纯文本答案收尾：只有该工具调用才算作你的结果。
```

## 关键参数
- `${STRUCTURED_OUTPUT_TOOL}`：值为 `structured_output`（常量，`structured.ts:19`），拼接进指令文本。

## Few-shot 示例
无

## 提示词链路
- 上游: `attachStructuredRuntime(childCtx, schema)`（`structured.ts:49`）在子代理创建窗口内注册本 section（order 190，工具指导带末尾）。
- 下游: 进入子代理的 `PromptAssembly.sections`，作为最后一个工具指导段，强制子代理以工具调用而非纯文本交付结构化结果。

## 相关代码上下文
- 函数: `attachStructuredRuntime`（`structured.ts:49`）。
- 关联工具: `structured_output`（`schemaEntry`，`structured.ts:64`）。
- 机制: 捕获采用两阶段提交——仅当权威 `tools/result` 成功后才提交值；单调工具守卫防止后续调用重开已完成的运行。
