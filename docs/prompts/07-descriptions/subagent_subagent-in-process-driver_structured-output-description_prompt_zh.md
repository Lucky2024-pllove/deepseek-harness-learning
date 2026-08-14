# 提示词翻译文档：structured_output 工具描述

## 元信息
- 原文件位置: `packages/subagent/subagent-in-process-driver/src/structured.ts:64-72`
- 变量名称: `schemaEntry.description`
- 功能模块: `@deepseek-ai/dsh-subagent-in-process-driver` — 进程内子代理结构化输出
- 调用场景: 作为 `structured_output` 工具的 description 注入结构化子代理
- 来源分类: 生产代码

## 英文原文
```plaintext
Report your final structured result. Call this exactly once, when your answer is complete; the arguments must match this tool's parameter schema exactly.
```

## 中文翻译
```plaintext
报告你的最终结构化结果。在答案完成时恰好调用一次；参数必须与该工具的参数 schema 精确匹配。
```

## 关键参数
- 无占位符。工具参数 schema 由调用方（结构化子代理）注入（`parameters: schema`）。

## Few-shot 示例
无

## 提示词链路
- 上游: `attachStructuredRuntime(childCtx, schema)`（`structured.ts:49`）构造 `schemaEntry` 并注册工具。
- 下游: 与 `STRUCTURED_OUTPUT_INSTRUCTION`（order 190 section）配套，共同约束子代理以工具调用交付结构化结果。

## 相关代码上下文
- 常量: `STRUCTURED_OUTPUT_TOOL = 'structured_output'`（`structured.ts:19`）。
- 关联: `STRUCTURED_OUTPUT_INSTRUCTION`（`structured.ts:26`）。
