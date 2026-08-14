# 提示词翻译文档

## 元信息
- 原文件位置: `packages/web/tool-web/src/fetch.ts:430-434`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:web_fetch`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——网页抓取工具 `web_fetch`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型用 `web_fetch` 获取指定 HTTP(S) URL 的内容（例如 `web_search` 返回的结果），并在使用内容时以 markdown 链接引用 URL
- 来源分类: 生产代码

## 英文原文
```text
Use the web_fetch tool to retrieve the content of a specific HTTP(S) URL (for example a result from web_search). It returns the page content decoded to text. Cite the URL as a markdown link when you use its content.
```

## 中文翻译
```text
使用 web_fetch 工具获取指定 HTTP(S) URL 的内容（例如 web_search 返回的某个结果）。它会返回解码为文本的页面内容。当你使用其内容时，请将该 URL 以 markdown 链接形式引用。
```

## 关键参数
- `url`：要抓取的 HTTP(S) URL（工具参数，必填）
- `timeoutMs`：协作式工具调用预算，附加为 `ToolDefinition.timeoutMs` 供超时策略强制执行
- `maxOutputChars`：完整渲染的工具输出字符上限（作用于 `formatFetchOutput`），也是同步转换的源字符上限（作用于 `fetchMetaFromValue`）
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-web` 的 `applyWebFetchTool(ctx, timeoutMs, maxOutputChars)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 430-434 行），参数来自插件配置解析
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型抓取网页后，`presentFetchResult` 将 `meta` 投影为 Web 抓取卡片（`WebFetchResultView`，card 为 `web`、kind 为 `fetch`，含 `statusCode`/`truncated`）
- Section 注册: `name: 'tool:web_fetch'`，`order: 111`（位于 100-199 工具指导带内，紧随 `tool:web_search` 之后），指导的工具为 `web_fetch`

## 相关代码上下文
`applyWebFetchTool`（`packages/web/tool-web/src/fetch.ts:429`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'web_fetch', ... }))`。输出 schema 含 `url`、`statusCode`、`body`（`oneOf`：`{kind: 'html'}` 或 `{kind: 'text'}`，均带 `content`）与 `truncated`；`formatFetchOutput` 按 `maxOutputChars` 上限渲染。`isConcurrencySafe: () => true` 注明 provider 读取不修改父 Agent 状态。该提示词与 `tool:web_search`（order 110）配合：搜索后发现候选 URL，抓取补充完整内容，并始终以 markdown 链接引用来源。
