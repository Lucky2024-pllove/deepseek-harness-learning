## 元信息
- 原文件位置: `packages/guard/repeat-tool-reminder/src/index.ts:63-67`
- 变量名称: `GENTLE_REMINDER`
- 功能模块: 重复工具调用提醒护栏（repeat-tool-reminder guard）
- 调用场景: 模型的连续重复工具调用计数首次命中阈值 `thresholds[0]`（默认 3）时，作为温和提醒注入下一次请求
- 来源分类: 生产代码

## 英文原文
```
You are repeating the exact same tool call with identical arguments. Carefully analyze the previous result before calling again: if the task is not complete, try a different approach or different arguments instead of repeating the call.
```

## 中文翻译
```
你正在重复调用完全相同的工具，且参数完全一致。再次调用之前，请仔细分析上一次的结果：如果任务尚未完成，请尝试不同的方法或不同的参数，而不是重复该调用。
```

## 关键参数
- 无占位符，纯静态文本常量
- 绑定到 `thresholds[0]`（第一个阈值）而非字面计数：自定义首阈值时仍保持"先温和、后详细"的升级节奏（见 `observe()` 第 200-202 行）

## Few-shot 示例
无

## 提示词链路
- 上游: `observe(exec)` 在 `tools/post-execute` 瀑布中统计连续重复：以 `JSON.stringify([toolName, canonical])` 为链键（canonical 为深度按键排序后的参数 JSON），命中 `thresholds[0]` 时选用 GENTLE_REMINDER
- 下游: 经 `createUserMessage` 生成用户消息，`source` 为 `{kind:'plugin', plugin:'repeat-tool-reminder', form:'notice', summary: '${name} × ${count}'}`，通过 `prependContext` 前置到 `PostToolDecision.additionalContexts`，随下一次模型请求进入上下文（被 block 的调用同样携带该提醒）
- 注入时机与 order: 工具执行后（`tools/post-execute` 监听器，第 213-224 行）；非 `systemPrompt.section` 注入，无 order —— 属于 post-execute 决策的 `additionalContexts` 通道。只观察提醒、绝不否决或改写调用；`agent/pre-step` 监听器在用户插话（`user` 来源消息）时重置链

## 相关代码上下文
`index.ts`：`GENTLE_REMINDER` 定义于第 63-67 行；`observe()`（第 189-207 行）完成计数并返回提醒；`prependContext`（第 147-149 行）保持下游上下文的 source 与元数据；配置 `thresholds` 默认 `[3, 5, 8]`（第 46 行）。
