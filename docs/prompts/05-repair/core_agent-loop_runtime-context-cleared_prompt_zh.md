## 元信息
- 原文件位置: `packages/core/agent-loop/src/runtime-context.ts:13`
- 变量名称: `CLEARED`
- 功能模块: 动态运行时上下文投影（Runtime Context Projection，agent-loop）
- 调用场景: 当渲染出的动态运行时上下文为空（`current.length === 0`）时，`project()` 用该文本生成一条"上下文已清空"快照用户消息，替换掉此前保留的运行时上下文快照
- 来源分类: 生产代码

## 英文原文
```
Current runtime context: none. Earlier runtime-context snapshots no longer apply.
```

## 中文翻译
```
当前运行时上下文：无。更早的运行时上下文快照不再适用。
```

## 关键参数
- 无占位符，纯静态文本常量
- 由 `project(current, sections)` 在 `current` 为空字符串时选用（`const snapshot = current.length === 0 ? CLEARED : current`）

## Few-shot 示例
无

## 提示词链路
- 上游: `RuntimeContextProjection.project(current, sections)` 的入参 `current` —— 完整渲染后的动态上下文（空字符串时触发清空标记）
- 下游: 经 `createUserMessage` 生成 `{type:'text', text: CLEARED}` 的用户消息，`source` 为 `{kind:'plugin', plugin:'@deepseek-ai/dsh-system-prompt'}`（sections 为空时无 `form`/`sections` 属性），作为未提交快照写入会话并进入模型请求
- 注入时机与 order: 非 `systemPrompt.section` 注入，无 order —— 属于会话事件（`user/message`）快照通道。投影器在每次渲染差异时提交快照，`retained` 字段去重避免重复；被替换性表面事件（replacement surface event）覆盖时清空为 `null`

## 相关代码上下文
`runtime-context.ts` 中 `RuntimeContextProjection` 类：`CLEARED` 定义于第 13 行；`project()`（第 64-75 行）仅在保留值不同时返回候选消息；构造器（第 34-56 行）恢复投影状态并监听 `session/event`，当 `isReplacementSurfaceEvent` 覆盖了保留快照的 seq 时置 `retained = null`。`SOURCE = '@deepseek-ai/dsh-system-prompt'` 用于识别归属该插件的消息（`isOwned`）。
