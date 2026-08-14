# 提示词翻译文档：deployment:persona（部署人格模板槽）

## 元信息
- 原文件位置: `packages/core/system-prompt/src/index.ts:364-369`（注册代码）；语义契约 JSDoc 在 `index.ts:191-195`；常量定义在 `index.ts:128`（`PERSONA_SECTION`）与 `index.ts:131`（`PERSONA_ORDER`）
- 变量名称: `deployment:persona`（`PERSONA_SECTION`，`SystemPrompt` 构造函数内注册的 section 名）
- 功能模块: `@deepseek-ai/dsh-system-prompt` — 系统提示词注册中心。本 section 是「部署人格」模板槽：文本内容完全来自部署配置 `config.persona`，默认空字符串，代码本身不提供任何预设文本。
- 调用场景: 每次模型推理步前经 `SystemPrompt.assemble()` 收集并按 `order: 0` 参与排序，渲染进系统提示词。`order: 0` 是 `PERSONA_ORDER`，在 section 约定中表示"模型读到的第一个 section"（所有负数 order 的 harness 自带 section 都渲染在它之前）。人格为空时被 `renderPrompt()` 过滤，不占任何 token。
- 来源分类: 生产代码

## 英文原文
本 section 的 text 是运行时槽位，英文原文即其语义契约（JSDoc，`index.ts:191-195`）与注册代码（`index.ts:364-369`）：

```ts
/**
 * Deployment-wide order-0 persona template. A scoped section named
 * `deployment:persona` shadows it; `{{variable}}` references are strict.
 */
persona?: string
```

```ts
this.section({
  name: PERSONA_SECTION,
  order: PERSONA_ORDER,
  // The fallback narrows the optional input type; the schema already defaults it.
  text: config.persona ?? '',
})
```

当部署方在 cordis.yml 中配置了 `persona` 时，模型实际读到的渲染文本即该配置值本身（可含 `{{variable}}` 引用）；未配置时 section 文本为空、不参与渲染。

## 中文翻译
语义契约翻译：
```ts
/**
 * 部署级 order-0 人格模板。名为 `deployment:persona` 的作用域 section 会遮蔽它；
 * `{{variable}}` 引用为严格模式（未知/畸形引用会抛错）。
 */
persona?: string
```

注册逻辑翻译：
```ts
this.section({
  name: PERSONA_SECTION,       // 'deployment:persona'
  order: PERSONA_ORDER,        // 0
  text: config.persona ?? '',  // 回退分支仅收窄可选输入类型；schema 已将其默认为 ''
})
```

## 关键参数
- `config.persona`（`string`，schema 默认 `''`）：部署方在插件配置中写入的人格模板，是本节唯一文本来源。
- `{{variable}}` 引用：允许出现在人格文本中，渲染时由 `renderPrompt()`/`interpolate()` 做严格插值——未知变量名、畸形引用（`{{}}`、含非法字符）、已注册但无值的变量均抛错（见 `index.ts:258-295`）。
- 遮蔽机制（shadowing）：作用域（scope）内注册的同名 `deployment:persona` section 会遮蔽全局的部署人格；agent preset 即借此用自己的 section 替换部署人格（见 `PERSONA_SECTION` 的导出注释，`index.ts:122-128`）。

## Few-shot 示例
无（本 section 是模板槽，示例与否完全由部署方在 `config.persona` 中决定）

## 提示词链路
- 上游: 部署配置 `config.persona`（cordis.yml 中 `systemPrompt.persona`），默认 `''`；`{{variable}}` 的值来自 `SystemPrompt.variable()` 注册的变量 provider。同名的作用域 section（如 agent preset）可整体遮蔽它。
- 下游: 进入 `PromptAssembly.sections`，按 `order` 升序渲染进系统提示词。渲染顺序：`harness:identity`（-100）→ `harness:source`（-99）→ `app:web-surface`（-98）→ …… → `deployment:persona`（0）→ 工具指引（100–199）。人格为空字符串时被 `renderPrompt()` 的空段过滤逻辑丢弃。

## 相关代码上下文
- 函数: `SystemPrompt` 构造函数（`index.ts:353`）、`SystemPrompt.section()`（`index.ts:381`）、`renderPrompt()`（`index.ts:212`）。
- 常量: `PERSONA_SECTION = 'deployment:persona'`（`index.ts:128`）、`PERSONA_ORDER = 0`（`index.ts:131`）。
- 配置 schema（`index.ts:339-345`）：`persona: z.string().default('')`。
- 说明：本提示词"原文为模板槽，无固定英文正文"——其可翻译内容即上述 JSDoc 语义契约与注册代码，已在上文给出英中对照。
