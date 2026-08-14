# 提示词翻译文档

## 元信息
- 原文件位置: `packages/fs/tool-fs/src/read.ts:70-74`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:read`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——文件读取工具 `read`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型用 `read` 工具（而非 shell 命令）查看文本文件，并正确使用 `offset`/`limit` 分页读取大文件
- 来源分类: 生产代码

## 英文原文
```text
Use the read tool — not shell commands like cat — to inspect text files. Results include line numbers. Use offset and limit to continue reading large files.
```

## 中文翻译
```text
请使用 read 工具（而不是 cat 之类的 shell 命令）来查看文本文件。结果包含行号。使用 offset 和 limit 继续读取大文件。
```

## 关键参数
- `file_path`：要读取的文件路径，由文件系统后端解析（`resolved by the filesystem backend`）
- `offset`：起始行号，1-based，默认 1；必须是正整数（`parseReadArgs` 中 `parsePositiveInteger` 校验）
- `limit`：最大返回行数，默认取部署上限 `maxLimit`（`caps.limit`），且不能超过 `maxLimit`；必须是正整数
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-fs` 的 `applyReadTool(ctx, caps)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 70-74 行），`caps` 为部署解析后的读取上限配置
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型读取文件时遵循此指导并传入 `file_path`/`offset`/`limit` 参数
- Section 注册: `name: 'tool:read'`，`order: 100`（100-199 工具指导带的起始位置），指导的工具为 `read`

## 相关代码上下文
`applyReadTool(ctx: Context, caps: ReadToolCaps)`（`packages/fs/tool-fs/src/read.ts:69`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'read', ... }))` 注册工具本体。工具 description 为 "Read a UTF-8 text file and return line-numbered content."（读取 UTF-8 文本文件并返回带行号的内容）。参数校验由 `parseReadArgs`（第 56-62 行）完成：`file_path` 非空、`offset`/`limit` 为正整数且 `limit <= maxLimit`。输出 schema 包含 `path`、`offset` 与 `lines`（`{number, text}` 数组）。该 section 的 order 100 是最低的工具指导顺序，位于所有工具指导的最前。
