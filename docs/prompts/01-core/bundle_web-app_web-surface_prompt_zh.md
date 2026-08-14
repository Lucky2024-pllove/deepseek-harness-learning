## 元信息
- 原文件位置: `packages/bundle/web-app/src/index.ts:95-106`（`webSurfacePrompt` 函数）
- 变量名称: `webSurfacePrompt`（函数名）；对应 section 名为 `app:web-surface`（`index.ts:144`）
- 功能模块: `@deepseek-ai/dsh-web-app` — Web 运行时 bundle。本提示词向模型说明"当前会话通过 DeepSeek Harness Web GUI 与用户交互"这一界面事实与验收边界（orientation and acceptance boundary），包括界面指向、无隐式浏览器上下文、HMR 更新契约、URL 验证与服务器启动纪律。
- 调用场景: 每次模型推理步前，作为文本 provider 求值：`text: () => webSurfacePrompt(localWebUrl(promptCtx))`（`index.ts:146`），即每个 assembly 用当时的 Web URL 重新求值。仅当配置 `surfaceContext: true` 时注册（`index.ts:140`）。
- 来源分类: 生产代码

## 英文原文
函数完整拼接结果（`webUrl` 为运行时求值参数）：

```
You are interacting with the user through the DeepSeek Harness Web GUI at ${webUrl}. When the user refers to "this page", "this GUI", or "this app" without naming another target, they mean this GUI. The browser provides no implicit DOM, route, or screenshot context. The client-plugin HMR receiver is active, but client-plugin changes reload without a refresh only while `pnpm run dev:web` is also running from this same checkout to rebuild their bundles; verify that watcher before promising automatic updates. Every other change — the apps/web shell and plain packages — requires rebuilding the affected Web artifacts and verifying this existing URL after a page refresh. Starting another server does not update this GUI. The apps/web Vite entry builds the shell but is not a standalone application because only dsh web injects window.__DSH_BOOT__. Do not start a replacement server unless the user asks; if one is needed, use a managed background job and verify its exact URL.
```

## 中文翻译
```
您正在通过 DeepSeek Harness Web GUI（网址为 ${webUrl}）与用户交互。当用户提到"此页面"、"此 GUI"或"此应用"而未指明其他目标时，指的就是这个 GUI。浏览器不会提供隐式的 DOM、路由或截图上下文。客户端插件的 HMR 接收器处于活动状态，但客户端插件的更改只有在同一检出目录下同时运行 `pnpm run dev:web` 以重建其 bundle 时，才会无需刷新即可重载；在承诺自动更新之前，请先验证该 watcher 是否在运行。所有其他更改——apps/web shell 与普通包——都需要重建受影响的 Web 构建产物，并在页面刷新后验证此现有 URL。启动另一个服务器并不会更新此 GUI。apps/web 的 Vite 入口会构建 shell，但它不是独立的应用程序，因为只有 dsh web 才会注入 window.__DSH_BOOT__。除非用户要求，否则不要启动替代服务器；如果确实需要，请使用受管的后台任务，并验证其确切 URL。
```

## 关键参数
- `${webUrl}`：本 GUI 的规范回环 URL（`http://127.0.0.1:<port>`），每次 assembly 由 `localWebUrl(ctx)`（`index.ts:109-113`）从 `webServer` 服务的 `port` 解析（JS 模板字符串插值，非 `{{variable}}` 提示词占位符）。
- 注册条件：配置 `surfaceContext`（默认值见 `apply()`，`index.ts:140` 起）为 `true`；且依赖 `systemPrompt` 服务注入。
- 固定标识符保持原样：`window.__DSH_BOOT__`、`pnpm run dev:web`、`dsh web`、GUI 等不翻译。

## Few-shot 示例
无

## 提示词链路
- 上游: `apply()`（`index.ts:135`）在 `surfaceContext` 开启时 `ctx.inject(['systemPrompt'], ...)`（`index.ts:141-148`），先调用 `addHarnessSourceSection` 注册 `harness:source`，再以 `text: () => webSurfacePrompt(localWebUrl(promptCtx))` 注册 `app:web-surface`。`webUrl` 每个 assembly 实时取自 `webServer` 服务端口。
- 下游: 注册为全局 section（`order: -98`）进入 `PromptAssembly.sections`，渲染顺序为 `harness:identity`（-100）→ `harness:source`（-99）→ `app:web-surface`（-98）→ …… → `deployment:persona`（0）。经 `renderPrompt()` 插值拼接后进入发送给模型的系统提示词。
- 语义意图：该段是"模型视角的界面契约"（Model-visible boundary）——告知模型当前交互通道是 Web GUI、浏览器不提供 DOM/路由/截图上下文（模型必须通过工具而非臆测来感知页面），并约束模型不得擅自启动替代服务器、不得在未验证 watcher 的情况下承诺 HMR 自动更新。

## 相关代码上下文
- 函数: `webSurfacePrompt(webUrl)`（`index.ts:95-106`）、`localWebUrl(ctx)`（`index.ts:109`）、`apply(ctx, config)`（`index.ts:135`）、`resolveLanTrust`（`index.ts:85`）。
- 注册代码：
  ```ts
  promptCtx.systemPrompt.section({
    name: 'app:web-surface',
    order: -98,
    text: () => webSurfacePrompt(localWebUrl(promptCtx)),
  })
  ```
- 常量: `DSH_WEB_URL = 'DSH_WEB_URL'`（`index.ts:67`，环境变量名，shellEnv 注册的配套变量）、`LOOPBACK_HOST = '127.0.0.1'`（`index.ts:71`）。
