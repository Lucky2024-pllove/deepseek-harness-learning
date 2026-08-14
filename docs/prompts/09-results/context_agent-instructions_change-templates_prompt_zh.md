# 提示词翻译文档：agent-instructions 变更通知模板

## 元信息
- 原文件位置: `packages/context/agent-instructions/src/render.ts:148-157, 171-184, 215-225`
- 变量名称: `additionalSectionText`（148）、`changedSectionText`（171）、`markerText`（215）
- 功能模块: `@deepseek-ai/dsh-agent-instructions` — 工作区指令渲染（变更批）
- 调用场景: 指令文件发生 set/remove/update 时，`renderInstructionChanges` 渲染增量通知；预算截断/省略时 `markerText` 生成诊断标记
- 来源分类: 生产代码

## 英文原文

### additionalSectionText（set 变更，`render.ts:148`）
```text
Additional instructions from: <displayPath>

These instructions apply to work under `<scope>`. Use them as guidance when relevant; more specific instructions take precedence. They do not override system, developer, or direct user instructions.

<file.content>
```

### changedSectionText — remove 分支（`render.ts:175`）
```text
Instructions removed: <path>

The previously loaded instructions from this file no longer apply.
```

### changedSectionText — update 分支（`render.ts:177`）
```text
Updated instructions from: <path>

This file changed after it was loaded. Use the following content instead of the previously loaded instructions from this file.

<file.content>
```

### markerText（预算标记，`render.ts:215`）
```text
Workspace instruction budget <maxBytes> bytes: omitted <path1>, <path2>; truncated <path> from <originalBytes> to <includedBytes> bytes
```

## 中文翻译

### additionalSectionText
```text
来自以下文件的附加指令：<displayPath>

这些指令适用于在 `<scope>` 下的工作。相关时将其作为指导；更具体的指令优先。它们不会覆盖系统、开发者或直接用户指令。

<file.content>
```

### changedSectionText — remove 分支
```text
指令已移除：<path>

先前从此文件加载的指令不再适用。
```

### changedSectionText — update 分支
```text
来自以下文件的更新指令：<path>

此文件在加载后发生了变更。使用以下内容替代先前从此文件加载的指令。

<file.content>
```

### markerText
```text
工作区指令预算 <maxBytes> 字节：省略 <path1>、<path2>；截断 <path> 从 <originalBytes> 到 <includedBytes> 字节
```

## 关键参数
- `${file.displayPath}` / `${scope}` / `${change.path}` / `${maxBytes}` / `${item.displayPath}` / `${item.originalBytes}` / `${item.includedBytes}`：JS 模板字符串插值。
- `<system-reminder>` 帧由 `buildInstructionText`（`render.ts:227-243`）统一包裹，帧内正文对 `</system-reminder>` 转义。

## Few-shot 示例
无

## 提示词链路
- 上游: `renderInstructionChanges(items, maxBytes)`（`render.ts:192`）按状态转换渲染增量；`markerText` 在 `buildInstructionText` 中先行计算。
- 下游: 渲染文本作为 user 消息注入模型，告知工作区指令的新增/移除/更新与预算截断情况。

## 相关代码上下文
- 函数: `additionalSectionText`（148）、`changedSectionText`（171）、`markerText`（215）、`buildInstructionText`（227）。
- 关联: `WORKSPACE_CONTEXT_INTRO` 等 4 个 intro 变体（见 workspace-context 翻译文档）。
