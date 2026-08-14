## 元信息
- 原文件位置: `packages/session-query/tool-session-query/src/index.ts:52-55`
- 变量名称: `PROMPT_TEXT`
- 功能模块: `@deepseek-ai/dsh-tool-session-query` — 会话查询工具
- 调用场景: 注册为 `tool:session-query` section（order 113），指导模型何时用 session_search / session_event_search / session_trace 等工具
- 来源分类: 生产代码

## 英文原文
```plaintext
Use session_search to find relevant work from prior sessions, or session_event_search to search earlier events in one session. Search results are cursor-free and workspace-scoped. Follow a useful hit with session_trace, session_event_trace, or session_event_read when you need lineage, relationships, or exact data.
```

## 中文翻译
```plaintext
使用 session_search 查找先前会话中的相关工作，或使用 session_event_search 搜索单个会话中的较早事件。搜索结果无游标、按工作区限定范围。当你需要血缘、关系或精确数据时，在有用命中之后，跟进使用 session_trace、session_event_trace 或 session_event_read。
```

## 关键参数
- 无占位符。本 section 静态文本，注册于 order 113。

## Few-shot 示例
无

## 提示词链路
- 上游: `apply()`（`index.ts:58`）注册 `tool:session-query` section（order 113），随后注册五个会话查询工具。
- 下游: 进入 `PromptAssembly.sections`，指导模型先搜索、再按需 trace/read。

## 相关代码上下文
- 函数: `apply(ctx, config)`（`index.ts:58`）。
- 关联工具: `session_search`、`session_event_search`、`session_trace`、`session_event_trace`、`session_event_read`。
