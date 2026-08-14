## 元信息
- 原文件位置: `packages/session/session-checkpoint-policy/src/index.ts:40-50`
- 变量名称: `abortedBeforeDispatchResult()` 返回的文本
- 功能模块: `@deepseek-ai/dsh-session-checkpoint-policy` — 语义检查点策略
- 调用场景: 顶层工具调用在 checkpoint 刷新后、工具体执行前信号已中止时，返回的模型可见错误结果（fail-closed）
- 来源分类: 生产代码

## 英文原文
```plaintext
Error: tool call aborted before dispatch
```

## 中文翻译
```plaintext
错误：工具调用在分派前已中止。
```

## 关键参数
- 无占位符。错误信息 `tool call aborted before dispatch`，错误码 `TOOL_ABORTED_BEFORE_DISPATCH`，`isError: true`。

## Few-shot 示例
无

## 提示词链路
- 上游: `tools/execute` 监听器（`index.ts:70-75`）在 `flush` 会话后检查 `exec.signal.aborted`，已中止则返回本结果、不再调用下游工具体。
- 下游: 作为工具结果反馈给模型，指示该调用因中止未执行。

## 相关代码上下文
- 函数: `abortedBeforeDispatchResult()`（`index.ts:41`）。
- 机制: checkpoint 策略在模型调用与工具副作用边界 fail-closed——checkpoint 失败或已中止时不调用下游。
