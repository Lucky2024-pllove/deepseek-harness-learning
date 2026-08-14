# 提示词翻译文档

## 元信息
- 原文件位置: `packages/fs/tool-fs/src/write.ts:63-67`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:write`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——文件写入工具 `write`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型何时使用 `write`（创建/整体替换）、覆盖语义，以及何时应改用 `edit`（针对性修改）
- 来源分类: 生产代码

## 英文原文
```text
Use the write tool to create files or completely replace file contents. Existing files are overwritten, so read an existing file first (the default fs-observation-policy requires it) and prefer edit for targeted changes.
```

## 中文翻译
```text
使用 write 工具创建文件或完全替换文件内容。已有文件会被覆盖，因此请先读取现有文件（默认的 fs-observation-policy 要求如此）；针对性的修改应优先使用 edit 工具。
```

## 关键参数
- `file_path`：要写入的路径，由文件系统后端解析
- `content`：要写入的完整 UTF-8 文本内容（整文件替换语义）
- `sandbox_permissions` / `justification`：仅在受约束的 `ctx.fs` 下出现在 schema 中的提权字段（由 `sandbox.schemaFields()` 条件展开），用于沙箱拒绝后的单次提权重试
- `fs-observation-policy`：默认的文件系统观测策略，要求写前先读（保持原样不翻译）
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-fs` 的 `applyWriteTool(ctx, sandbox)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 63-67 行），`sandbox` 为共享的沙箱提权控制器
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型写入文件时遵循此指导
- Section 注册: `name: 'tool:write'`，`order: 101`（位于 100-199 工具指导带内，紧随 `tool:read` 之后），指导的工具为 `write`

## 相关代码上下文
`applyWriteTool(ctx: Context, sandbox: FsSandboxController)`（`packages/fs/tool-fs/src/write.ts:62`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'write', ... }))`。工具 description 为 "Create or fully replace a UTF-8 text file."（创建或完全替换 UTF-8 文本文件）。输出 schema 含 `path`、`operation`（`create`/`update`）、`before`、`after`，并以 `formatWriteOutput` 渲染为模型可见的 `<path>/<type>/<content>` 结构（"Created file" / "Updated file"）。`WriteToolArgs` 接口（第 50-55 行）声明了提权字段，仅在受约束的 `ctx.fs` 下公布。
