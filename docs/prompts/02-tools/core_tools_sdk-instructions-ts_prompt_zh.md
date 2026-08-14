## 元信息
- 原文件位置: `packages/core/tools/src/ts-types.ts:250-259`
- 变量名称: `SDK_INSTRUCTIONS`（TypeScript 风味）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——Code Mode 的 TypeScript SDK 使用契约（`tools:sdk` section 的固定头部说明）
- 调用场景: `runtime.language === 'typescript'` 时，`renderToolsSdk` 将 `SDK_INSTRUCTIONS` 与生成的 `declare const tools` 接口拼接，作为 `tools:sdk` section 渲染进系统提示词；模型在 Code Mode 下按此契约用 TypeScript 编写 `run_code` 程序
- 来源分类: 生产代码

## 英文原文
```text
## Writing code for run_code

`run_code` takes two required arguments: `code` — the body of an async TypeScript function (erasable syntax only — no `enum` or namespaces; type annotations are advisory, the code runs type-stripped) — and `description`, a short summary of what the program does. Inside the program:

- Call tools as `await tools.name(args)` — quoted access for exotic names: `tools["my-tool"](args)`. Every call resolves to the tool's typed canonical JSON value. Tool arguments must be lossless JSON.
- A FAILED tool call rejects with `ToolCallError`, whose `toolName` identifies the failed tool and whose `message` is human-readable — `try/catch` it to handle and continue.
- Independent read-only calls MAY overlap under `Promise.all` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with `await`.
- Emit results with `return` and/or `console.log(...)`. ONLY what you print or return comes back to you — intermediate tool results never enter the conversation, so extract just what you need.

The available tools:
```

## 中文翻译
```text
## 为 run_code 编写代码

`run_code` 接受两个必填参数：`code`——一个异步 TypeScript 函数体（仅限可擦除语法——不允许 `enum` 或命名空间；类型注解仅供参考，代码运行时会被剥离类型）——以及 `description`，对程序功能的简短总结。在程序内部：

- 以 `await tools.name(args)` 的形式调用工具——对特殊名称使用带引号的访问：`tools["my-tool"](args)`。每次调用都会解析为该工具类型化的规范 JSON 值。工具参数必须是无损 JSON。
- 失败的调用会以 `ToolCallError` 拒绝，其 `toolName` 标识失败的工具，`message` 为人类可读信息——用 `try/catch` 捕获以处理并继续。
- 相互独立的只读调用可以在 `Promise.all` 下重叠执行（安全调用并发运行；变更类调用按提交顺序单独运行）。有依赖关系的工作用 `await` 串行化。
- 用 `return` 和/或 `console.log(...)` 输出结果。只有你打印或返回的内容才会回到你这里——中间的工具结果永远不会进入对话，因此只提取你需要的部分。

可用的工具如下：
```

## 关键参数
- `code`：异步 TypeScript 函数体（仅可擦除语法：无 `enum`/命名空间；类型注解仅作参考，运行时剥离类型）
- `description`：程序功能的简短总结
- `tools.name(args)` / `tools["my-tool"](args)`：工具调用语法（普通点访问 / 特殊名称带引号访问），每个调用解析为工具类型化的规范 JSON 值
- `ToolCallError`：失败调用拒绝时抛出的错误，含 `toolName`（失败工具标识）与 `message`（人类可读信息）
- `Promise.all`：独立只读调用可重叠执行的并发机制（安全调用并发、变更调用按提交顺序串行）
- `return` / `console.log(...)`：结果输出方式，仅打印/返回内容会回到模型
- 生成的 `declare const tools` 接口（`renderToolsSdk` 按工具名字典序输出）接在 "The available tools:" 之后

## Few-shot 示例
无（`code` 参数描述中的 `await tools.name(args)`、`tools["my-tool"](args)` 等为语法示例，非完整 Few-shot 演示）

## 提示词链路
- 上游: 常量由 `renderToolsSdk(schemas)`（`ts-types.ts:273`）消费——先输出 `SDK_INSTRUCTIONS`，再按字典序生成每个工具的 `args`/`output` 类型成员，最终返回 `${SDK_INSTRUCTIONS}\n\n\`\`\`ts\n${jsonValue}\n\n${declaration}\n\`\`\``（第 292 行）；调用方为 `dsh-tools` 的 `sdkSection()`（`index.ts:875`），按调用作用域的可见工具（排除 `run_code` 自身）生成
- 下游: 作为 `tools:sdk` section 渲染进最终系统提示词；模型据此编写 `run_code` 程序并在程序内调用各 SDK 工具
- Section 注册: `name: 'tools:sdk'`，`order: 150`（`SDK_SECTION_ORDER`，位于 100-199 工具指导带内、各工具指导之后）；`renderToolsSdk` 由 `SDK_RENDERERS.typescript` 指向（`index.ts:61`）

## 相关代码上下文
`SDK_INSTRUCTIONS` 定义于 `packages/core/tools/src/ts-types.ts:250-259`，注释说明其为渲染在声明之上的固定模型可见使用契约（"The fixed model-facing usage contract rendered above the declarations (see the Code Mode Agent Note's 'What the model sees')"）。渲染确定性保证：工具按名字典序输出，未变化的工具集会生成字节级一致的文本。`renderToolsSdk` 调用 `jsonSchemaToTs` 把统一 schema 映射为 TS 类型字面量（不支持/畸形输入回退为 `unknown`）。
