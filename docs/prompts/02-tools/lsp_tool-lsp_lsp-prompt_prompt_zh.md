# 提示词翻译文档

## 元信息
- 原文件位置: `packages/lsp/tool-lsp/src/index.ts:54-55`（注册处：第 104 行）
- 变量名称: `LSP_PROMPT_TEXT`
- 功能模块: 工具使用指导层（Tool Usage Guidance）——语言服务器（LSP）代码导航工具
- 调用场景: 插件 `apply` 阶段作为 section `tool:lsp` 注册到系统提示词；常驻模型上下文，指导模型在何种场景使用 `lsp` 工具进行精确的代码导航（定义/引用/实现/hover）
- 来源分类: 生产代码

## 英文原文
```text
Use search/read for ordinary navigation. Use lsp when textual matches are ambiguous or before a change requires precise definitions, implementations, or references. Positions are one-based line and character (UTF-16) at the cursor; an off-symbol position may return no results. findReferences always includes the declaration.
```

## 中文翻译
```text
常规导航请使用 search/read。当文本匹配存在歧义，或在进行修改之前需要精确的定义、实现或引用时，请使用 lsp。位置是光标处的从 1 开始计数的行号和字符偏移（UTF-16）；偏离符号的位置可能返回空结果。findReferences 始终包含声明本身。
```

## 关键参数
- `operation`：LSP 操作类型，取值为 `goToDefinition` / `findReferences` / `goToImplementation` / `hover`（工具 schema 中的 `enum`，由 `LSP_OPERATIONS` 定义）
- `line` / `character`：光标坐标，均为 1-based 的 UTF-16 行号和字符偏移（工具 schema 输出 `LSP_POSITION_OUTPUT_SCHEMA`）
- `findReferences`：引用查询操作，其返回结果必然包含声明位置（与提示词所述一致）
- 提示词本身无模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-lsp` 插件的 `apply` 通过 `ctx.systemPrompt.section({ name: 'tool:lsp', order: 112, text: LSP_PROMPT_TEXT })` 静态注册（第 104 行），无运行时输入
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型据此决定何时调用 `lsp` 工具，并按 1-based UTF-16 坐标传递参数
- Section 注册: `name: 'tool:lsp'`，`order: 112`（位于 100-199 工具指导带内，在 web 工具之后），指导的工具为 `lsp`
- 常量注释说明其定位："The stable system-prompt guidance positioning LSP as a precision aid."（把 LSP 定位为精准辅助的稳定系统提示词指导）

## 相关代码上下文
`LSP_PROMPT_TEXT` 定义于 `packages/lsp/tool-lsp/src/index.ts:54-55`，是导出常量；`apply` 函数（第 98-104 行）先做配置校验（`assertPositiveInteger`/`assertTimer`），再注册提示词 section，随后注册 `lsp` 工具（`defineTool({ name: 'lsp', ... })`）。工具的 description 与提示词语义一致：`operation is one of goToDefinition, findReferences, goToImplementation, hover. line and character are one-based UTF-16 cursor coordinates. findReferences includes the declaration.` 工具调用预算默认 `DEFAULT_LSP_TOOL_TIMEOUT_MS = 60_000`，覆盖排队 open/query/close 的完整生命周期。
