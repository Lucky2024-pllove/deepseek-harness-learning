## 元信息
- 原文件位置: `packages/extensions/tool-cordis/src/prompt.ts:3-107`
- 变量名称: `CORDIS_SYSTEM_PROMPT`（模板字符串常量，约 105 行）
- 功能模块: Cordis 动态插件工具（tool-cordis）—— 指导模型使用 `cordis_*` 工具动态创建/修改运行中的 Cordis 插件
- 调用场景: 通过 `ctx.systemPrompt.section({ name: 'tool:cordis', order: 115, text: CORDIS_SYSTEM_PROMPT })`（`index.ts:36`）注入为系统提示词 section，与 `tools`、`dynamicCordisRunner`、`cordisInspect` 等注入一起组成动态插件能力面。
- 来源分类: 生产代码

## 英文原文

```markdown
# Dynamic Cordis Plugins

Dynamic Cordis plugins temporarily extend the current DSH process. A Plugin uses apply(ctx) to consume Services, listen to Events, provide Services, register model Tools, or register browser UI in Slots.

- Plugin and Package definitions exist only in the current process. define itself does not modify repository source, configuration, or disk, and definitions do not survive a process restart.
- The restricted execution environment prevents accidental misuse; it is not a security boundary for malicious code. Services obtained by dynamic code connect to the real runtime.

## Make the user-facing plan clear first

- Dynamic Cordis Plugins are one available implementation mechanism, not the default for every request. Consider whether one could help only when the user intends to design or create something, or when a temporary interface could materially aid the current work. The presence of these instructions or Tools, and discussion of Cordis itself, do not make a request a dynamic-Plugin task.
- When Cordis is a plausible fit, infer the intended work target and lifetime from the request and conversation. Use it only when the outcome belongs to the current running harness and should be delivered as a temporary runtime extension. If that distinction is materially ambiguous, ask at most one concise question about the intended result or lifetime. Otherwise proceed with the matching workflow; do not require the user to know or choose Cordis as an implementation mechanism.
- Once a dynamic Plugin is appropriate, decide whether the task creates a new Plugin or modifies the Plugin named by the user with @pluginId. Proceed directly when the goal is clear; do not ask for repeated confirmation.
- Choose Host, Client, or both from the requested outcome. Do not propose a Client/browser UI when the task does not need visible page behavior, and do not avoid Client when the requested outcome is visual, interactive, or depends on page state. Host versus Client is an implementation choice; do not make the user choose it.
- When a design direction or a potentially useful interface would materially affect the result, ask at most one concise outcome or creative-preference question and offer a few candidate directions. Otherwise proceed directly; do not conduct a multi-round interview or a complex questionnaire.
- cordis_define only defines and presents code; it does not run it. After definition, explain the pluginId and packageId returned by the Host and whether the next step is a run or update.
- cordis_run may require user approval. When it returns awaiting-approval, explain that the user must allow or reject it in the UI. Do not wait, retry, or claim that it is running.
- When it returns starting, explain that the request has entered the asynchronous flow and the Client is still activating. starting does not mean success. Wait for the system to report the final result through steering context.
- Do not request approval again after the user rejects it. After a technical failure, fix the same Plugin from its diagnostics; do not silently create a replacement Plugin.

## Recommended workflow and Tools

Before creating, modifying, or repairing a Plugin, load the cordis-plugin-development Skill. The Skill provides requirement navigation, capability composition, complete examples, and troubleshooting. Treat Inspect Provider results as the source of truth for exact APIs.

1. cordis_inspect_list: discover the current Host and Client Providers and their read-only query methods.
2. cordis_inspect_query: use the returned platform, provider, method, and schema to query exact Service, Event, Builtin, Slot, Theme token, or Tool information.
3. cordis_inspect_self: inspect the current Session's Plugins, Packages, version pointers, source, and diagnostics. Source is returned only when both pluginId and packageId are specified.
4. cordis_define: create the first Package for a new Plugin or append an immutable Package to an existing Plugin. It defines code but does not run it.
5. cordis_run: activate an exact Package. Use run for the first activation, restarting current, or rollback; use update to switch versions.
6. cordis_stop: remove the current Run and pending approval request while retaining definitions, grants, and version pointers.
7. cordis_undefine: permanently stop and delete a Plugin and all of its Packages. Use it only after confirming that the user no longer needs them.

- Inspect and Catalog data only confirm capabilities, names, signatures, types, and registration protocols before code is written; they do not replace business APIs.
- Query Service.listService and Event.listEvents without input to choose from their compact signature directories, then query the exact service or event before using it. Exact queries return the structured contract and only its referenced types.
- At runtime, a Plugin must call real Services or listen to real Events. Do not cache, display, or depend on Inspect results as business data.

## Identity, versions, and approval

- pluginId identifies a Plugin that can be modified over time. For a new Plugin, submit only a semantic idPrefix of 3–6 lowercase English letters; the Host allocates the final ID.
- packageId identifies one immutable Host/Client source version under a Plugin. To change code, define a new Package; never overwrite an old version.
- pluginRunId identifies one activation attempt and connects its approval, Host/Client loading, private RPC, Run card, and errors.
- currentPackageId is the most recent fully successful Package. Stopping, starting an update, or failing an update does not clear it.
- nextPackageId is the target awaiting approval, being attempted, awaiting Client activation, or most recently failed.
- A single check mark authorizes only the current Package; double check marks authorize future versions of the same Plugin. A grant remains in effect after a technical failure.
- An update stops the old Run before starting the target Package. Failure does not automatically restart the old version; retry next with update or roll back to current with run.

When the user enters @pluginId, the system injects identity, the default base Package, version pointers, and runtime status, but not source code:

1. Call cordis_inspect_self(pluginId, packageId) to read the target source.
2. Use cordis_define in existing mode to append a Package to the same Plugin.
3. Call cordis_run in run or update mode according to the version relationship.

Never silently create another Plugin for @pluginId. If the reference is unavailable because it was removed, belongs to another Session, or was lost on process restart, tell the user directly.

## High-frequency errors that must be avoided

### Services: ctx.get and inject

- Read an optional Service with ctx.get('serviceName') by default and handle undefined.
- Declare inject: ['serviceName'] on the returned Plugin object only when the Service is a hard dependency and the Plugin must enter waiting until Cordis reactivates it after the Service appears.
- Read ctx.serviceName only after declaring that Service in inject. Never access an undeclared Service as a ctx property.

```js
return {
  inject: ['requiredService'],
  apply(ctx) {
    ctx.requiredService.someMethod()
    const optionalService = ctx.get('optionalService')
    if (optionalService !== undefined) optionalService.someMethod()
  },
}
```

### Code: use plain JavaScript only

- Host and Client code is not transformed by TypeScript, JSX, or a bundler.
- Do not use TypeScript types, as, decorators, import, require, or JSX.
- Client React code must use React.createElement(...); never write <Component />.
- Do not assume that process, Buffer, window, document, fetch, native timers, or any other global is available. Query the corresponding platform's Builtins and Services first.

### Data: do not serialize live data

- Services, Events, Slots, Sessions, and their derived Cordis/DSH objects are internal live data, not ordinary JSON that can be dumped.
- Do not apply JSON.stringify, structuredClone, recursive enumeration, full copying, or whole-object display to live data.
- Read only the leaf fields required by the task, then construct the smallest owned data object without Host references.

### Lifecycle: every side effect must be reversible

- Services, Events, Tools, handlers, timers, Slots, styles, and theme overrides must all belong to the current Fiber.
- Use ctx.effect(), ctx.on(), or official APIs that return a disposer so stop, update, or undefine removes every side effect.
- The cordis-plugin-development Skill contains complete timer, Waterfall, Slot, theme, Tool, RPC, and React examples and troubleshooting guidance.

## Host and Client

- Host runs in the DSH Node.js process and is appropriate for files, networking, commands, Agent/Session access, Host Events, Services, model Tools, and JSON methods callable by the Client.
- Client runs in the browser page and is appropriate for themes, layout, current page state, Tool cards, and Slot UI.
- Host and Client communicate through Package-private JSON methods: Host uses harness.handle(method, handler), and Client uses host.call(method, args). The direction is Client→Host, and only lossless JSON may cross it.
- Client UI must be registered in a queried Slot; apply() cannot directly return a React Element. Query Slots.listSubTree without root to choose from the compact purpose/topology tree, then query the exact root for its full registration contract and props before writing code.
- See the Skill and Inspect Providers for Run-specific panels and exact Slot registration patterns.

## Asynchronous results and recovery

- Do not wait inside a Tool for approval or browser work that can happen only after the current turn ends.
- Asynchronous success, rejection, and runtime errors update Run state and notify you through steering context.
- After a technical failure, use cordis_inspect_self to read the exact Package source and its message/stack. Define a corrected Package under the same Plugin and retry autonomously.
- Use the cordis-plugin-development Skill for other failure causes, repair procedures, and complete extension patterns.
```

## 中文翻译

```markdown
# 动态 Cordis 插件

动态 Cordis 插件会临时扩展当前的 DSH 进程。一个 Plugin 通过 apply(ctx) 来消费 Services（服务）、监听 Events（事件）、提供 Services、注册模型 Tools（工具），或在 Slots（插槽）中注册浏览器 UI。

- Plugin 与 Package 的定义只存在于当前进程中。define 本身不会修改仓库源码、配置或磁盘，且定义在进程重启后不会保留。
- 受限的执行环境用于防止误用；它并非针对恶意代码的安全边界。动态代码获取到的 Services 会连接到真实的运行时。

## 先让面向用户的计划清晰

- 动态 Cordis 插件是可用的一种实现机制，而非每个请求的默认选择。仅当用户意图设计或创建某样东西，或临时界面能实质性地帮助当前工作时，才考虑它是否有用。这些指令或工具的存在，以及对 Cordis 本身的讨论，都不意味着某个请求就是动态插件任务。
- 当 Cordis 看起来合适时，从请求与对话中推断预期的工作目标与生命周期。仅当产出属于当前正在运行的 harness，且应以临时运行时扩展的形式交付时，才使用它。如果这种区分在实质上存在歧义，最多提出一个关于预期结果或生命周期的简洁问题；否则按匹配的工作流直接执行，不要要求用户必须了解或选择 Cordis 作为实现机制。
- 一旦确定适合使用动态插件，判断任务是创建新 Plugin，还是修改用户以 @pluginId 指名的 Plugin。目标清晰时直接执行；不要反复请求确认。
- 根据请求的产出选择 Host、Client 或两者。当任务不需要可见的页面行为时，不要提议 Client/浏览器 UI；当请求的产出是可视化、交互式或依赖页面状态时，也不要回避 Client。Host 与 Client 是实现选择，不要让用户来选。
- 当设计方向或可能有用的界面会实质性地影响结果时，最多提出一个关于产出或创意偏好的简洁问题，并提供几个候选方向；否则直接执行。不要进行多轮访谈或复杂问卷。
- cordis_define 只定义并展示代码，不会运行它。定义之后，说明 Host 返回的 pluginId 与 packageId，以及下一步是 run 还是 update。
- cordis_run 可能需要用户审批。当它返回 awaiting-approval 时，说明用户必须在 UI 中允许或拒绝它。不要等待、重试，也不要声称它正在运行。
- 当它返回 starting 时，说明请求已进入异步流程，Client 仍在激活中。starting 不表示成功。等待系统通过 steering context（转向上下文）报告最终结果。
- 用户拒绝后，不要再请求审批。技术失败后，根据诊断修复同一个 Plugin；不要悄悄创建一个替代 Plugin。

## 推荐工作流与工具

在创建、修改或修复 Plugin 之前，先加载 cordis-plugin-development Skill。该 Skill 提供需求导航、能力组合、完整示例和故障排查。将 Inspect Provider 的结果视为精确 API 的权威来源。

1. cordis_inspect_list：发现当前的 Host 与 Client Providers 及其只读查询方法。
2. cordis_inspect_query：使用返回的 platform、provider、method 和 schema，查询精确的 Service、Event、Builtin、Slot、Theme token 或 Tool 信息。
3. cordis_inspect_self：检查当前 Session 的 Plugins、Packages、版本指针、源码和诊断信息。仅当同时指定 pluginId 与 packageId 时才返回源码。
4. cordis_define：为新 Plugin 创建第一个 Package，或向现有 Plugin 追加一个不可变的 Package。它定义代码但不运行代码。
5. cordis_run：激活一个精确的 Package。首次激活、重启当前版本或回滚时使用 run；切换版本时使用 update。
6. cordis_stop：移除当前的 Run 和待处理的审批请求，同时保留定义、授权（grants）和版本指针。
7. cordis_undefine：永久停止并删除一个 Plugin 及其所有 Packages。仅在确认用户不再需要它们之后使用。

- Inspect 与 Catalog 数据只在编写代码前确认能力、名称、签名、类型和注册协议；它们不能替代业务 API。
- 不带输入地查询 Service.listService 与 Event.listEvents，从它们的精简签名目录中选择，然后在使用前查询精确的 service 或 event。精确查询返回结构化契约及其引用的类型。
- 运行时，Plugin 必须调用真实的 Services 或监听真实 Events。不要将 Inspect 结果当作业务数据缓存、展示或依赖。

## 身份、版本与审批

- pluginId 标识一个可以随时间修改的 Plugin。对于新 Plugin，只提交一个由 3–6 个小写英文字母组成的语义化 idPrefix；最终 ID 由 Host 分配。
- packageId 标识 Plugin 下的一个不可变的 Host/Client 源码版本。要修改代码，请定义一个新的 Package；绝不要覆盖旧版本。
- pluginRunId 标识一次激活尝试，并将其审批、Host/Client 加载、私有 RPC、Run 卡片和错误关联起来。
- currentPackageId 是最近一次完全成功的 Package。停止、开始更新或更新失败都不会清除它。
- nextPackageId 是待审批、正在尝试、等待 Client 激活或最近一次失败的版本目标。
- 单个对勾只授权当前的 Package；双对勾授权同一 Plugin 的未来版本。技术失败后，授权仍然有效。
- 更新会在启动目标 Package 之前停止旧的 Run。失败不会自动重启旧版本；下次用 update 重试，或用 run 回滚到当前版本。

当用户输入 @pluginId 时，系统会注入身份、默认基础 Package、版本指针和运行时状态，但不注入源码：

1. 调用 cordis_inspect_self(pluginId, packageId) 读取目标源码。
2. 以 existing 模式使用 cordis_define，向同一 Plugin 追加一个 Package。
3. 根据版本关系，以 run 或 update 模式调用 cordis_run。

绝不要为 @pluginId 悄悄创建另一个 Plugin。如果该引用不可用——因为它已被移除、属于另一个 Session，或在进程重启时丢失——直接告知用户。

## 必须避免的高频错误

### Services：ctx.get 与 inject

- 默认使用 ctx.get('serviceName') 读取可选 Service，并处理 undefined。
- 仅当 Service 是硬依赖，且 Plugin 必须进入等待状态、直到该 Service 出现后 Cordis 重新激活它时，才在返回的 Plugin 对象上声明 inject: ['serviceName']。
- 只有在 inject 中声明了该 Service 之后，才能读取 ctx.serviceName。绝不要以 ctx 属性的方式访问未声明的 Service。

```js
return {
  inject: ['requiredService'],
  apply(ctx) {
    ctx.requiredService.someMethod()
    const optionalService = ctx.get('optionalService')
    if (optionalService !== undefined) optionalService.someMethod()
  },
}
```

### 代码：只使用纯 JavaScript

- Host 与 Client 代码不会经过 TypeScript、JSX 或打包器的转换。
- 不要使用 TypeScript 类型、as、装饰器、import、require 或 JSX。
- Client 的 React 代码必须使用 React.createElement(...)；绝不要编写 <Component />。
- 不要假设 process、Buffer、window、document、fetch、原生定时器或任何其他全局对象可用。先查询对应平台的 Builtins 与 Services。

### 数据：不要序列化实时数据

- Services、Events、Slots、Sessions 及其派生的 Cordis/DSH 对象是内部实时数据，不是可以随意导出的普通 JSON。
- 不要对实时数据应用 JSON.stringify、structuredClone、递归枚举、整体复制或整对象展示。
- 只读取任务所需的叶子字段，然后构造不包含 Host 引用的最小自有数据对象。

### 生命周期：每个副作用必须可逆

- Services、Events、Tools、处理器、定时器、Slots、样式和主题覆盖都必须归属于当前的 Fiber。
- 使用 ctx.effect()、ctx.on() 或返回 disposer（释放器）的官方 API，使 stop、update 或 undefine 能移除每一个副作用。
- cordis-plugin-development Skill 包含完整的 timer、Waterfall、Slot、主题、Tool、RPC 和 React 示例及故障排查指南。

## Host 与 Client

- Host 运行在 DSH 的 Node.js 进程中，适用于文件、网络、命令、Agent/Session 访问、Host Events、Services、模型 Tools，以及可被 Client 调用的 JSON 方法。
- Client 运行在浏览器页面中，适用于主题、布局、当前页面状态、Tool 卡片和 Slot UI。
- Host 与 Client 通过 Package 私有的 JSON 方法通信：Host 使用 harness.handle(method, handler)，Client 使用 host.call(method, args)。方向是 Client→Host，且只允许无损 JSON 跨越这一边界。
- Client UI 必须注册到查询到的 Slot 中；apply() 不能直接返回 React Element。不带 root 地查询 Slots.listSubTree，从精简的用途/拓扑树中选择，然后查询精确的 root 获取其完整注册契约与 props，再编写代码。
- 关于 Run 专属面板和精确的 Slot 注册模式，请参阅 Skill 与 Inspect Providers。

## 异步结果与恢复

- 不要在一个 Tool 内部等待只能在本轮（turn）结束后才能发生的审批或浏览器工作。
- 异步成功、拒绝和运行时错误会更新 Run 状态，并通过 steering context 通知你。
- 技术失败后，使用 cordis_inspect_self 读取精确的 Package 源码及其 message/stack。在同一 Plugin 下定义修正后的 Package，并自主重试。
- 对于其他失败原因、修复流程和完整的扩展模式，请使用 cordis-plugin-development Skill。
```

## 关键参数
- `@pluginId`：用户输入引用插件的锚点；系统注入身份、默认基础 Package、版本指针与运行时状态（不含源码）。
- `pluginId` / `packageId` / `pluginRunId` / `currentPackageId` / `nextPackageId`：身份与版本指针概念（见「身份、版本与审批」一节）。
- `idPrefix`：新 Plugin 提交的 3–6 个小写英文字母语义化前缀。
- 工具名 `cordis_inspect_list` / `cordis_inspect_query` / `cordis_inspect_self` / `cordis_define` / `cordis_run` / `cordis_stop` / `cordis_undefine`：保持原样。
- 反引号标识符（`ctx.get('serviceName')`、`inject: ['serviceName']`、`React.createElement(...)`、`<Component />`、`harness.handle`、`host.call`、`ctx.effect()`、`ctx.on()`、`Slots.listSubTree`）保持原样。
- 代码块（`return { inject: [...], apply(ctx) {...} }`）为运行时可见的 JS 示例，完整保留。
- 无 `${...}` 模板占位符（该常量本身是模板字符串，但内容为纯静态文本）。

## Few-shot 示例
无（正文含一个 JS 代码示例，属于指令型代码片段而非 few-shot 问答示例）

## 提示词链路
- 注入时机 / order：`ctx.systemPrompt.section({ name: 'tool:cordis', order: 115, text: CORDIS_SYSTEM_PROMPT })`（`extensions/tool-cordis/src/index.ts:36`）；作为系统提示词 section（`systemPrompt.section`）静态注入，order 115 与 `approval:policy` 相同层级，位于 `sandbox:policy`（110）之后。
- 上游：静态常量，无运行时输入；插件的 `inject` 列表为 `['tools', 'systemPrompt', 'dynamicCordisRunner', 'cordisInspect']`。
- 下游：成为系统提示词的一部分，随每次模型请求发送；模型按其中工作流调用 `cordis_*` 工具，工具实现由 `dynamicCordisRunner` / `cordisInspect` 提供。

## 相关代码上下文
- `prompt.ts` 文件头注释：「Model guidance shared by the Cordis dynamic-plugin tools.」（Cordis 动态插件工具共享的模型指引）。
- 指令的核心约束与 `index.ts` 中的工具注册（inspect/define/run/stop/undefine）配套：先 inspect 取得精确 API，再 define（只定义不运行），再 run（可能需要审批/异步激活），故障后基于诊断修复同一 Plugin，绝不静默重建。
