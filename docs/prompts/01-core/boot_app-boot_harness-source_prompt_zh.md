## 元信息
- 原文件位置: `packages/boot/app-boot/src/index.ts:821-829`（text 本体在第 827 行）
- 变量名称: `harness:source`（`HARNESS_SOURCE_SECTION`，`index.ts:805`）
- 功能模块: `@deepseek-ai/dsh-boot-app-boot` — 应用二进制（app bin）的共享引导胶水。`addHarnessSourceSection()` 在引导完成后向全局系统提示词追加一段，声明 Harness 实现代码检出目录的位置，并明确区分"检出位置"与"任务工作区/当前工作目录"。
- 调用场景: 引导完成（`boot()` 之后的 settled context）后调用一次；例如 web-app 的 `apply()` 在 `surfaceContext` 配置开启时通过 `ctx.inject(['systemPrompt'], ...)` 调用它（`packages/bundle/web-app/src/index.ts:140-148`）。section 以 `order: -99` 注册，恰好排在 harness 身份（-100）之后、部署人格（0）之前。
- 来源分类: 生产代码

## 英文原文
```
The DeepSeek Harness implementation checkout is at ${sourceRoot}. The checkout location and current working directory are separate values and may differ; never infer the working directory from this path. Use pwd to determine the current working directory. Use this checkout only to inspect or extend DSH itself.
```

## 中文翻译
```
DeepSeek Harness 实现代码检出目录位于 ${sourceRoot}。检出位置与当前工作目录是两个独立的值，二者可能不一致；切勿根据此路径推断工作目录。请使用 pwd 确定当前工作目录。该检出目录仅用于检查或扩展 DSH 本身。
```

## 关键参数
- `${sourceRoot}`：Harness 检出目录的绝对路径（JS 模板字符串在注册时插值，不是提示词 `{{variable}}` 占位符）。来源：调用方传入，如 web-app 传入 `SOURCE_ROOT`（检出根目录常量）。
- 注册条件：仅当 `ctx.get('systemPrompt')` 返回已挂载的 `systemPrompt` 服务时才注册；未挂载则返回 `undefined`（无提示词可扩充，no-op）。
- 行为特性：section 注册在 `systemPrompt` 服务的 fiber 上，因此该插件的 dev HMR 重载会丢弃本段，直到下次 boot 重新注册（JSDoc，`index.ts:814-816`）。

## Few-shot 示例
无

## 提示词链路
- 上游: 引导完成的 ctx + `sourceRoot`（检出根目录绝对路径）。由 `addHarnessSourceSection(ctx, sourceRoot)`（`index.ts:821`）在 boot 后调用，web-app 的 `apply()`（`packages/bundle/web-app/src/index.ts:140-148`）是生产调用方之一。
- 下游: 注册为全局 section 进入 `PromptAssembly.sections`，渲染顺序为 `harness:identity`（-100）→ `harness:source`（-99）→ `app:web-surface`（-98）→ …… → `deployment:persona`（0）。经 `renderPrompt()` 插值拼接后进入发送给模型的系统提示词。
- 语义意图：该段向模型声明"实现代码在哪、怎么用"——`dsh-tool-cordis` 自引用工具集会读取并编辑这份检出（JSDoc，`index.ts:810-811`），因此模型需要知道检出路径与工作目录的区别，且只能用它检查/扩展 DSH 本身。

## 相关代码上下文
- 函数: `addHarnessSourceSection(ctx, sourceRoot)`（`index.ts:821-829`）、`boot()`（同文件引导流程）。
- 常量: `HARNESS_SOURCE_SECTION = 'harness:source'`（`index.ts:805`）。
- 关键代码：
  ```ts
  export function addHarnessSourceSection(ctx: Context, sourceRoot: string): (() => void) | undefined {
    const systemPrompt = ctx.get('systemPrompt')
    if (systemPrompt === undefined) return undefined
    return systemPrompt.section({
      name: HARNESS_SOURCE_SECTION,
      order: -99,
      text: `The DeepSeek Harness implementation checkout is at ${sourceRoot}. ...`,
    })
  }
  ```
