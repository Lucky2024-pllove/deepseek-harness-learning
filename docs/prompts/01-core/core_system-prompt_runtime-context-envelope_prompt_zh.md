# 提示词翻译文档：runtime-context 信封（运行时上下文快照声明）

## 元信息
- 原文件位置: `packages/core/system-prompt/src/index.ts:236-240`（`joinContextSections` 函数的固定前缀）
- 变量名称: 无命名常量；函数 `joinContextSections`，前缀文本即本提示词本体
- 功能模块: `@deepseek-ai/dsh-system-prompt` — 动态运行时上下文（dynamic runtime context）快照的信封（envelope）。动态上下文由各子系统通过 `SystemPrompt.context()` 注册，组装后以"user 角色的持久快照"写入模型历史。
- 调用场景: 每次模型推理步前，`SystemPrompt.assemble()` 收集上下文贡献（按 `order` 升序、可被 `suppressRuntimeContext()`/`includeRuntimeContext` 抑制），`renderContextSnapshot()` → `joinContextSections()` 把各段以空行拼接，并在最前面冠以本声明段。整份快照随后作为持久化的 user-role 快照注入模型历史。
- 来源分类: 生产代码

## 英文原文
固定前缀（`index.ts:239`）：
```
Current runtime context. This snapshot supersedes earlier runtime-context snapshots.
```

完整输出结构（`index.ts:236-240`）：
```
Current runtime context. This snapshot supersedes earlier runtime-context snapshots.

{body}
```
其中 `{body}` 是各上下文段（`ContextSnapshotSection[].text`）以 `'\n\n'` 拼接的结果；当 body 为空时整个函数返回 `''`（不发任何快照）。

## 中文翻译
```
当前运行时上下文。此快照取代更早的运行时上下文快照。
```

## 关键参数
- 无 `{{variable}}` 占位符。
- `sections: readonly ContextSnapshotSection[]`：输入参数，每项含 `name`（贡献子系统名）与 `text`（已解析文本）。仅渲染为非空文本的段才会出现在数组中（`renderContextSections` 已过滤）。
- 行为参数：`body` 为空 → 返回 `''`，不产出信封；否则返回前缀 + 空行 + body。

## Few-shot 示例
无

## 提示词链路
- 上游: `renderContextSections(assembly)`（`index.ts:251-255`）产出非空上下文段列表；其输入是 `SystemPrompt.assemble()` 收集的 `PromptAssembly.contexts`（作用域合并 + 按 order 排序 + 运行时上下文抑制检查）。抑制途径：`suppressRuntimeContext()`（作用域级）或配置 `includeRuntimeContext: false`（全局）。
- 下游: `renderContextSnapshot(assembly)`（`index.ts:224-226`）调用本函数，把完整快照字符串作为动态上下文注入模型历史。按 `PromptContext` 的 JSDoc（`index.ts:77-85`），该快照"物化为持久化的 user 角色快照"——信封中的"取代更早快照"即告诉模型：只以最新一份运行时上下文为准，旧快照失效，从而避免多轮对话中上下文累积冲突。

## 相关代码上下文
- 函数: `joinContextSections`（`index.ts:236`）、`renderContextSnapshot`（`index.ts:224`）、`renderContextSections`（`index.ts:251`）、`interpolate`（`index.ts:258`）。
- 关键代码：
  ```ts
  export function joinContextSections(sections: readonly ContextSnapshotSection[]): string {
    const body = sections.map(section => section.text).join('\n\n')
    if (body.length === 0) return ''
    return `Current runtime context. This snapshot supersedes earlier runtime-context snapshots.\n\n${body}`
  }
  ```
- 本函数同时服务"需要保留每段归属"的消费方：它们用 `renderContextSections` 拿到带 `name` 的段列表自行呈现，避免重新拆分拼接后的正文（JSDoc，`index.ts:242-250`）。
