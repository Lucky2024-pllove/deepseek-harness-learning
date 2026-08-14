# 提示词翻译文档

## 元信息
- 原文件位置: `packages/context/agent-instructions/src/render.ts:12-19`
- 变量名称: `WORKSPACE_CONTEXT_INTRO`（12-14）、`REPLACEMENT_WORKSPACE_CONTEXT_INTRO`（15-16）、`EMPTY_REPLACEMENT_WORKSPACE_CONTEXT_INTRO`（17-18）、`COMPACT_WORKSPACE_CONTEXT_INTRO`（19）
- 功能模块: 工作区指令渲染（agent-instructions）—— 在显式字节预算内渲染模型可见的工作区指令
- 调用场景: 基线渲染（baseline）与变更批渲染（reconciliation batch）共用；渲染结果整体包进 `<system-reminder>` 帧。基线在会话加载/变更时生成；指令文件发生 set/replace/remove 时通过 `renderInstructionChanges` 渲染增量。`COMPACT_...` 变体仅在内容超出字节预算、需要截断/省略时启用。
- 来源分类: 生产代码

> 说明：四个 intro 变体合并为一份文档，分别标注。

## 英文原文

### WORKSPACE_CONTEXT_INTRO（`render.ts:12-14`）
```text
The following workspace instructions may be relevant to your work. Use them as guidance when applicable. More specific instructions take precedence over broader ones. They do not override system, developer, or direct user instructions.
```

### REPLACEMENT_WORKSPACE_CONTEXT_INTRO（`render.ts:15-16`）
```text
This complete workspace instruction baseline replaces all earlier workspace instruction baselines. The following workspace instructions may be relevant to your work. Use them as guidance when applicable. More specific instructions take precedence over broader ones. They do not override system, developer, or direct user instructions.
```

### EMPTY_REPLACEMENT_WORKSPACE_CONTEXT_INTRO（`render.ts:17-18`）
```text
This complete workspace instruction baseline replaces all earlier workspace instruction baselines. No workspace instructions are currently active.
```

### COMPACT_WORKSPACE_CONTEXT_INTRO（`render.ts:19`）
```text
Workspace instructions were omitted or truncated to fit the configured byte budget.
```

## 中文翻译

### WORKSPACE_CONTEXT_INTRO
```text
以下工作区指令可能与你的工作相关。适用时请将其作为指导。更具体的指令优先于更宽泛的指令。它们不会覆盖系统（system）、开发者（developer）或直接用户（direct user）指令。
```

### REPLACEMENT_WORKSPACE_CONTEXT_INTRO
```text
这一完整的工作区指令基线取代了之前所有的工作区指令基线。以下工作区指令可能与你的工作相关。适用时请将其作为指导。更具体的指令优先于更宽泛的指令。它们不会覆盖系统、开发者或直接用户指令。
```

### EMPTY_REPLACEMENT_WORKSPACE_CONTEXT_INTRO
```text
这一完整的工作区指令基线取代了之前所有的工作区指令基线。当前没有生效的工作区指令。
```

### COMPACT_WORKSPACE_CONTEXT_INTRO
```text
工作区指令被省略或截断，以适配配置的字节预算（byte budget）。
```

## 关键参数
- 渲染选项 `{ maxBytes: number; replacePreviousBaseline?: boolean }`：
  - `maxBytes` —— 渲染结果（含 `<system-reminder>` 帧与预算标记）允许的最大 UTF-8 字节数；`<= 0` 或非有限值时返回空渲染、全部文件记入 `omitted`。
  - `replacePreviousBaseline === true` 时 intro 切换为 REPLACEMENT/EMPTY_REPLACEMENT 变体；且当已加载文件为空时，仍渲染 EMPTY_REPLACEMENT 基线（显式空替换集）。
- `file.displayPath`：模型可见的指令文件路径（项目相对或 `$DSH_HOME/AGENTS.md`）；section 文本格式为 `Instructions from: <displayPath>`。
- 标签 `<system-reminder>` / `</system-reminder>`：渲染帧（`buildInstructionText` 第 242 行），帧内正文对 `</system-reminder>` 做转义（`<\/system-reminder>`）防止指令内容破坏帧结构。
- 字节预算诊断标记（`markerText`）：`Workspace instruction budget ${maxBytes} bytes: omitted ...; truncated ... from N to M bytes`。

## Few-shot 示例
无

## 提示词链路
- 注入时机 / order：渲染文本由调用方包帧后进入模型消息；`loadBaselineInstructionSet`（`files.ts:405-449`）在会话初始化/基线变更时调用 `renderWorkspaceInstructionSet` 生成基线（含空替换集路径）；变更批通过 `renderInstructionChanges`（`render.ts:192-213`）渲染并只保留确实呈现了的转换。
- 上游：`discoverInstructionFiles` 发现 + `readBounded` 限源大小读取得到的 `LoadedInstructionFile[]`（按从宽泛到最具体排序）；`dedupInstructionFilesByDirectory` 去重。
- 下游：`RenderedWorkspaceContext`（`text` + `omitted` + `truncated` 记录）交给调用方嵌入会话上下文；`represented`/`included` 集合用于精确记录哪些文件语义上被呈现（含真实空文件——其标题仍传达「指令存在但无内容」）。

## 相关代码上下文
- `renderInstructionContext`（`render.ts:275-332`）实现预算内渲染策略：完整文本超预算时先按优先级从前向后省略，仍超则对最具体文件二分截断（`truncateToFit`，UTF-8 安全——不切断多字节码点），最终回退到仅预算标记。
- `COMPACT_WORKSPACE_CONTEXT_INTRO` 在截断循环中被作为候选 intro 试渲染（第 302 行）。
- `additionalSectionText`（`render.ts:148-157`）用于 `set` 变更：`Additional instructions from: <path>` + scope 说明；`remove` 输出 `Instructions removed: <path>`；`replace` 输出 `Updated instructions from: <path>`。
