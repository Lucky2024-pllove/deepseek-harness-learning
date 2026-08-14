# 提示词翻译文档

## 元信息
- 原文件位置: `packages/web/tool-web/src/search.ts:216-222`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:web_search`；文本按 `fetchEnabled` 三元选择两个变体）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——网页搜索工具 `web_search`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型使用 `web_search` 发现网上信息、使用返回的答案/源 URL 列表，并根据 `fetchEnabled` 决定是否推荐用 `web_fetch` 跟进
- 来源分类: 生产代码

## 英文原文
```text
（变体 A：fetchEnabled = true，即同一组合中暴露了 web_fetch）
Use the web_search tool to discover current information on the web. It returns an optional answer plus a list of source URLs. Follow up with web_fetch when you need the full content of a specific result, and cite the relevant URLs as markdown links.

（变体 B：fetchEnabled = false，未暴露 web_fetch）
Use the web_search tool to discover current information on the web. It returns an optional answer plus a list of source URLs. Use the returned source snippets when available, and cite the relevant URLs as markdown links.
```

## 中文翻译
```text
（变体 A：fetchEnabled = true）
使用 web_search 工具发现网上的最新信息。它会返回一个可选的回答外加源 URL 列表。当你需要某个具体结果的完整内容时，用 web_fetch 跟进，并将相关 URL 以 markdown 链接形式引用。

（变体 B：fetchEnabled = false）
使用 web_search 工具发现网上的最新信息。它会返回一个可选的回答外加源 URL 列表。可用时请使用返回的源摘要，并将相关 URL 以 markdown 链接形式引用。
```

## 关键参数
- `query`：搜索查询词（工具参数）
- `maxResults`：部署配置的源上限，作为每次 seam 请求的 `maxResults` 发送
- `timeoutMs`：协作式工具调用预算，附加为 `ToolDefinition.timeoutMs` 供 `@deepseek-ai/dsh-tool-call-timeout-policy` 强制执行
- `fetchEnabled`：布尔配置，指示同一组合是否暴露 `web_fetch` 工具；决定提示词是否推荐该跟进工具
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-web` 的 `applyWebSearchTool(ctx, maxResults, timeoutMs, fetchEnabled)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 216-222 行），参数来自插件配置解析
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型执行搜索后，`presentSearchResult` 将 `meta` 中的 sources 投影为 Web 搜索卡片（`WebSearchResultView`，card 为 `web`、kind 为 `search`）
- Section 注册: `name: 'tool:web_search'`，`order: 110`（位于 100-199 工具指导带内），指导的工具为 `web_search`（并可推荐 `web_fetch`）

## 相关代码上下文
`applyWebSearchTool`（`packages/web/tool-web/src/search.ts:210`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'web_search', ... }))`，`execute` 通过 `ctx.web.search({ query: input.query, maxResults }, exec.signal)` 调用 provider，结果包含可选的 `content`（回答）、`sources`（URL/标题/摘要/发布时间）与 `truncated` 标志；`formatSearchOutput` 渲染为文本。`isConcurrencySafe: () => true` 注明 provider 读取不修改父 Agent 状态，可并发执行。两个变体的差异体现了「未暴露的工具不应被推荐」的提示词纪律：`fetchEnabled` 为 false 时引导模型使用返回的源摘要（snippet）代替抓取。
