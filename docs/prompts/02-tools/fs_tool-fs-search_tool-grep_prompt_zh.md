# 提示词翻译文档

## 元信息
- 原文件位置: `packages/fs/tool-fs-search/src/grep.ts:276-280`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:grep`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——文件内容搜索工具 `grep`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型用 `grep` 工具（而非 shell 的 grep/rg）搜索文件内容，并在需要上下文时对命中的文件使用 `read`
- 来源分类: 生产代码

## 英文原文
```text
Use the grep tool — not shell grep or rg — to search file contents. Use read on a matched file when you need surrounding context.
```

## 中文翻译
```text
使用 grep 工具（而不是 shell 的 grep 或 rg）来搜索文件内容。当你需要命中文件周围的上下文时，对命中的文件使用 read。
```

## 关键参数
- `pattern`：要搜索的正则表达式（ripgrep 语法）
- `path`：要搜索的文件或目录；默认是会话工作区，相对路径按工作区解析
- `include`：一个 glob 过滤器，用于限定搜索哪些文件（如 `"*.ts"`、`"*.{js,jsx}"`）；不是列表，不支持取反
- `maxMatches`（配置 `caps.maxMatches`）：内联返回的最大匹配数；超限的结果会报告完整匹配列表保存的位置
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-fs-search` 的 `applyGrepTool(ctx, caps)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 276-280 行），`caps` 为部署解析后的 grep 上限配置（含 `maxMatches`、`timeoutMs`）
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型搜索文件内容时遵循此指导
- Section 注册: `name: 'tool:grep'`，`order: 104`（位于 100-199 工具指导带内，紧随 `tool:glob` 之后），指导的工具为 `grep`

## 相关代码上下文
`applyGrepTool(ctx: Context, caps: GrepToolCaps)`（`packages/fs/tool-fs-search/src/grep.ts:275`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'grep', ... }))`，执行使用 `subprocess` 服务。工具 description："Search file contents with a ripgrep regular expression. Returns matching lines with line numbers, grouped by file..."（用 ripgrep 正则搜索文件内容，返回带行号的匹配行并按文件分组）。输出 schema 为 `matches` 数组（`path`/`lineNumber`/`line`），并通过 `presentGrepResult` 将 `presentationMeta` 投影为搜索卡片视图（`SearchResultView`，shape 为 `matches`），无搜索卡片时回退到通用 `tool/result` 内容。
