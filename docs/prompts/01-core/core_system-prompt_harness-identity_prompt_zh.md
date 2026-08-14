## 元信息
- 原文件位置: `packages/core/system-prompt/src/index.ts:357-363`（text 本体在第 361 行）
- 变量名称: `harness:identity`（`SystemPrompt` 构造函数内 `this.section({ ... })` 注册的 section 名）
- 功能模块: `@deepseek-ai/dsh-system-prompt` — 系统提示词注册中心（System Prompt Registry）。本 section 是 Harness 身份声明，系统提示词的第一段、`-100` 序的开场白。
- 调用场景: 每次模型推理步（model step）前，`SystemPrompt.assemble()` 收集全局与作用域内的 section，本 section 以 `order: -100` 参与排序；组装后经 `renderPrompt()` 插值、过滤空段、以空行拼接，作为系统提示词发送给模型。默认启用（`includeHarnessIdentity` 默认 `true`）。
- 来源分类: 生产代码

## 英文原文
```
You are an AI agent powered by DeepSeek Harness.
```

## 中文翻译
```
你是一个由 DeepSeek Harness 驱动的 AI 智能体。
```

## 关键参数
- 无占位符。注册条件由配置项 `includeHarnessIdentity`（`boolean`，默认 `true`）控制：
  - `true`（默认）：注册本 section，作为系统提示词的第一段；
  - `false`：跳过注册，系统提示词不含身份声明。
- 相关常量：`order: -100`（本 section 的排序值，在 `PromptSection.order` 的约定中 `-100` 即 "harness identity"）。

## Few-shot 示例
无

## 提示词链路
- 上游: `SystemPrompt` 构造函数（`packages/core/system-prompt/src/index.ts:353-363`）。由配置 `includeHarnessIdentity` 决定是否注册；文本为静态字符串，不依赖 `AssembleContext`。
- 下游: 进入 `PromptAssembly.sections`，按 `order` 升序排序后由 `renderPrompt()` 渲染（`{{variable}}` 插值 → 过滤空段 → `'\n\n'` 拼接），作为系统提示词的开场段发给模型。`system-prompt/assemble` waterfall 可对其整体做权威替换；若存在 `complete` section，组装后仅保留该 complete section。

## 相关代码上下文
- 函数: `SystemPrompt` 构造函数（`index.ts:353`）、`SystemPrompt.section()`（`index.ts:381`）、`renderPrompt()`（`index.ts:212`）。
- 注册代码：
  ```ts
  if (config.includeHarnessIdentity ?? true) {
    this.section({
      name: 'harness:identity',
      order: -100,
      text: 'You are an AI agent powered by DeepSeek Harness.',
    })
  }
  ```
- 排序约定（`PromptSection.order` 的 JSDoc，`index.ts:56-61`）：section 按 `order` 升序拼接，`-100` 为 harness 身份、`0` 为部署人格、工具指引使用 100–199；其他负数 order 也渲染在人格之前。
