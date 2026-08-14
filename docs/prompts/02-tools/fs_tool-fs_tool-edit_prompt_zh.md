# 提示词翻译文档

## 元信息
- 原文件位置: `packages/fs/tool-fs/src/edit.ts:77-81`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:edit`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——文件编辑工具 `edit`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型对现有 UTF-8 文本文件做针对性修改（字面量替换），包括唯一匹配约束与 `replace_all` 的用法
- 来源分类: 生产代码

## 英文原文
```text
Use the edit tool for targeted changes to existing UTF-8 text files. It replaces literal old_string with new_string; by default old_string must appear exactly once. If old_string appears multiple times, provide a more specific old_string or set replace_all to true. Read the file first (the default fs-observation-policy requires it), unless you just created or edited it in this session.
```

## 中文翻译
```text
使用 edit 工具对现有 UTF-8 文本文件做针对性修改。它用 new_string 替换字面量 old_string；默认情况下 old_string 必须恰好出现一次。如果 old_string 出现多次，请提供更具体的 old_string，或将 replace_all 设为 true。请先读取该文件（默认的 fs-observation-policy 要求如此），除非你刚在本会话中创建或编辑过它。
```

## 关键参数
- `file_path`：要编辑的文件路径，由文件系统后端解析
- `old_string`：要替换的字面量文本，必须精确匹配；默认须恰好出现一次（`parseEditArgs` 中要求非空）
- `new_string`：替换文本，可为空字符串（用于删除匹配项）
- `replace_all`：是否替换所有匹配项，默认 `false`；为 `false` 时 `old_string` 必须恰好出现一次
- `fs-observation-policy`：默认的文件系统观测策略，要求编辑前先读取文件（保持原样不翻译）
- `sandbox_permissions` / `justification`：提权字段，仅在受约束的 `ctx.fs` 下由 `sandbox.schemaFields()` 条件展开
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-fs` 的 `applyEditTool(ctx, sandbox)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 77-81 行），`sandbox` 为共享的沙箱提权控制器
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型编辑文件时遵循此指导
- Section 注册: `name: 'tool:edit'`，`order: 102`（位于 100-199 工具指导带内，紧随 `tool:write` 之后），指导的工具为 `edit`

## 相关代码上下文
`applyEditTool(ctx: Context, sandbox: FsSandboxController)`（`packages/fs/tool-fs/src/edit.ts:76`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'edit', ... }))`。参数校验由 `parseEditArgs`（第 47-57 行）完成：`file_path` 非空、`old_string` 非空、`old_string !== new_string`、`replace_all` 默认 false。成功结果由 `formatEditOutput` 渲染：`replace_all` 为 true 时输出 "The file {path} has been updated. All occurrences were successfully replaced."，否则输出 "The file {path} has been updated successfully."。输出 schema 含 `path`、`before`、`after` 三个字段。
