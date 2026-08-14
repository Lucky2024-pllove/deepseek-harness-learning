## 元信息
- 原文件位置: `packages/web/tool-web/src/fetch.ts:247`
- 变量名称: `TRUNCATION_FOOTER`
- 功能模块: `@deepseek-ai/dsh-tool-web` — web_fetch 工具
- 调用场景: 当 provider 或输出上限截断了抓取内容时，作为页脚追加到模型可见的 fetch 输出文本末尾
- 来源分类: 生产代码

## 英文原文
```text
(Content truncated. Fetch a more specific URL or section for the full text.)
```

## 中文翻译
```text
（内容已截断。获取更具体的 URL 或段落以查看全文。）
```

## 关键参数
- 无占位符。开头为 `\n\n`（两个换行，与正文分隔）。

## Few-shot 示例
无

## 提示词链路
- 上游: `renderFetch`（或同类渲染函数）在 provider 截断、转换前源截断、或完整输出超过 `maxOutputChars` 时追加本页脚。
- 下游: 作为 fetch 工具结果文本的一部分注入模型，提示模型换更具体的 URL 获取全文。

## 相关代码上下文
- 常量: `TRUNCATION_FOOTER`（`fetch.ts:247`）。
- 关联: `tool:web_fetch` section（`fetch.ts:430`）。
