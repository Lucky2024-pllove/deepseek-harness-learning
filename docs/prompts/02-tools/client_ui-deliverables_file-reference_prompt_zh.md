# 提示词翻译文档

## 元信息
- 原文件位置: `packages/client/ui-deliverables/src/index.ts:15-16`（注册处：第 22-27 行）
- 变量名称: `FILE_REFERENCE_PROMPT`
- 功能模块: 工具使用指导层（Tool Usage Guidance）——最终回复中的文件引用渲染约定（与浏览器端渲染器配对的模型指导）
- 调用场景: 插件 `apply` 阶段作为 section `ui:deliverable-file-references` 注册到系统提示词；常驻模型上下文，指导模型在成功创建/修改文件后于最终回复中提及主要输出，并按规定格式（Markdown 行内代码）让文件引用在 Web 界面可点击
- 来源分类: 生产代码

## 英文原文
```text
When you successfully create or modify files, mention the primary outputs in your final response. To make those and any other changed-file references clickable in Web, format them as Markdown inline code using the exact file-tool path, or a basename when unique among the files changed in that turn.
```

## 中文翻译
```text
当你成功创建或修改文件时，请在最终回复中提及主要输出。为了让这些引用以及其他更改文件的引用在 Web 中可点击，请使用确切的文件工具路径将它们格式化为 Markdown 行内代码；当基名在该轮更改的文件中唯一时，也可以使用基名。
```

## 关键参数
- 无模板占位符；指导中的两个格式约定为：
  - `Markdown inline code`：Markdown 行内代码格式（反引号包裹）
  - `exact file-tool path`：确切的文件工具路径（如 `fs_tool-fs_tool-read_prompt_zh.md` 这类由文件工具返回的路径）
  - `basename`：文件名基名，仅当在该轮更改的文件中唯一时使用

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `ui-deliverables` 插件的 `apply(ctx)` 函数通过 `ctx.systemPrompt.section({ name: 'ui:deliverable-file-references', order: 190, text: FILE_REFERENCE_PROMPT })` 静态注册（第 22-27 行），无运行时输入
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型据此在最终回复中输出可被浏览器端渲染器识别为文件引用的行内代码
- Section 注册: `name: 'ui:deliverable-file-references'`，`order: 190`（位于 100-199 工具指导带内、接近带尾，属于 UI 交付物 section，不指导具体工具而是指导最终回复格式）

## 相关代码上下文
`FILE_REFERENCE_PROMPT` 是 `packages/client/ui-deliverables/src/index.ts` 的模块内常量（第 15-16 行，通过字符串拼接两段构成），注释说明它是 "Stable final-response guidance owned by the matching renderer."（由匹配的渲染器拥有的稳定最终回复指导）。该插件是 node 半区（node half），注册响应格式指导让浏览器半区（browser half，通过 `exports["./client"]` 与 package.json 的 `dsh.client` 声明交付）能识别最终回复中的文件引用并渲染为可点击链接。插件仅注入 `systemPrompt` 服务。
