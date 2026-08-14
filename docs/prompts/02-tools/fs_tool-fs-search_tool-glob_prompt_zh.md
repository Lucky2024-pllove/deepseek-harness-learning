## 元信息
- 原文件位置: `packages/fs/tool-fs-search/src/glob.ts:301-306`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:glob`；文本尾部拼接 `overCapGuidance` 变量）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——文件路径发现工具 `glob`
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型用 `glob` 工具（而非 shell 的 find）按路径模式发现文件，并理解无 `/` 模式的匹配语义与超限结果的返回方式
- 来源分类: 生产代码

## 英文原文
```text
Use the glob tool — not shell find — to discover files by path pattern. A pattern with no "/" matches basenames at any depth, so "*" matches every file in the tree rather than its top level. Results are files only, never directories, and include hidden and ignored files: a result that fits comes back in modification-time order, while a larger one keeps the modification-time-ordered head.
```

> 注：末尾一句随配置 `sampleOverCapGlobResults` 有两种变体。默认（`false`）为上方 `...keeps the modification-time-ordered head.`；开启抽样时（`true`）替换为 `...is sampled across top-level entries, so it spans the tree instead of one subtree.`

## 中文翻译
```text
使用 glob 工具（而不是 shell 的 find）按路径模式发现文件。不含 "/" 的模式会匹配任意深度的基名，因此 "*" 会匹配树中的所有文件，而不仅仅是顶层。结果只包含文件，绝不包含目录，并且包括隐藏和被忽略的文件：能放得下的结果按修改时间顺序返回，而更大的结果则保留修改时间排序的头部。
```

> 抽样变体（`sampleOverCapGlobResults: true`）：末尾句译为「而更大的结果会在顶层条目中抽样，使其横跨整棵树而不是单个子树。」

## 关键参数
- `pattern`：用于匹配文件路径的 glob 模式（如 `"**/*.ts"`、`"src/**/*.test.js"`）；不含 `/` 的模式按基名在任意深度匹配，含 `/` 可锚定深度
- `path`：要搜索的目录；默认是会话工作区，相对路径按工作区解析
- `maxResults`（配置 `caps.maxResults`）：按修改时间顺序返回的路径数上限
- `sampleOverCapGlobResults`（配置开关）：决定超限时是「保留修改时间排序的头部」（默认）还是「在顶层条目中抽样」
- 提示词本身无模板占位符（`overCapGuidance` 为代码拼接变量，非模型可见占位符）

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-fs-search` 的 `applyGlobTool(ctx, caps)` 函数通过 `ctx.systemPrompt.section()` 静态注册（第 301-306 行），`caps` 为部署解析后的 glob 上限配置；`overCapGuidance`（第 298-300 行）按 `caps.sampleOverCapGlobResults` 选择文案
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型发现文件路径时遵循此指导
- Section 注册: `name: 'tool:glob'`，`order: 103`（位于 100-199 工具指导带内，紧随 `tool:edit` 之后），指导的工具为 `glob`

## 相关代码上下文
`applyGlobTool(ctx: Context, caps: GlobToolCaps)`（`packages/fs/tool-fs-search/src/glob.ts:297`）注册提示词后调用 `ctx.tools.register(defineTool({ name: 'glob', ... }))`，执行使用 `subprocess` 服务。工具 description 与提示词语义一致："Find files whose paths match a glob pattern. Returns matching file paths — never directories — including hidden and ignored files (VCS metadata directories are excluded)..."。输出 schema 含 `root` 与 `paths` 数组，由 `renderGlobPaths` 渲染为文本，并通过 `presentGlobResult` 投影为搜索卡片视图（`SearchResultView`，shape 为 `paths`）。
