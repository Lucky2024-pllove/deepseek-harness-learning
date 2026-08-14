## 元信息
- 原文件位置: `packages/core/tools/src/py-types.ts:734-743`
- 变量名称: `SDK_INSTRUCTIONS`（Python 风味）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——Code Mode 的 Python SDK 使用契约（`tools:sdk` section 的固定头部说明）
- 调用场景: `runtime.language === 'python'` 时，`renderToolsSdkPy` 将 `SDK_INSTRUCTIONS` 与生成的 `TypedDict`/`Tools` 协议声明拼接，作为 `tools:sdk` section 渲染进系统提示词；模型在 Code Mode 下按此契约用 Python 编写 `run_code` 程序
- 来源分类: 生产代码

## 英文原文
```text
## Writing code for run_code

`run_code` takes two required arguments: `code` — the body of an async Python function (top-level `await` and `return` both work) — and `description`, a short summary of what the program does. At run time exactly two of the names declared below are bound: `tools` and `ToolCallError`. Everything else is a STATIC STUB describing argument and return types — in particular the `TypedDict` classes do NOT exist at run time, so build arguments as plain `dict`/`list` JSON values: `await tools.name({"field": 1})`, never `FooArgs(field=1)`, which raises `NameError`. Inside the program:

- Call tools as `await tools.name(args)` — subscript access for exotic, reserved, or underscore-leading names: `await tools["my-tool"](args)`. Every call resolves to the tool's typed canonical JSON value (each method's return type below). Tool arguments must be lossless JSON.
- A FAILED tool call raises `ToolCallError`, whose `toolName` identifies the failed tool and whose message is human-readable — wrap in `try/except` to handle and continue.
- Independent read-only calls MAY overlap under `asyncio.gather` (safe calls run concurrently; mutating calls run alone, in submission order). Sequence dependent work with `await`.
- Emit the run's answer with `print(...)` and/or a top-level `return <value>`; the returned value must be lossless JSON. ONLY what you print and the returned value come back — intermediate tool results never enter the conversation, so extract just what you need.

The available tools:
```

## 中文翻译
```text
## 为 run_code 编写代码

`run_code` 接受两个必填参数：`code`——一个异步 Python 函数体（顶层 `await` 和 `return` 都可用）——以及 `description`，对程序功能的简短总结。运行时，下面声明的名称中恰好有两个被绑定：`tools` 和 `ToolCallError`。其他一切都是描述参数和返回类型的静态桩（STATIC STUB）——特别是 `TypedDict` 类在运行时并不存在，因此请以纯 `dict`/`list` JSON 值构造参数：`await tools.name({"field": 1})`，绝不要 `FooArgs(field=1)`，那会抛出 `NameError`。在程序内部：

- 以 `await tools.name(args)` 的形式调用工具——对特殊、保留或以 `_` 开头的名称使用下标访问：`await tools["my-tool"](args)`。每次调用都会解析为该工具类型化的规范 JSON 值（即下方每个方法的返回类型）。工具参数必须是无损 JSON。
- 失败的调用会抛出 `ToolCallError`，其 `toolName` 标识失败的工具，`message` 为人类可读信息——用 `try/except` 包裹以处理并继续。
- 相互独立的只读调用可以在 `asyncio.gather` 下重叠执行（安全调用并发运行；变更类调用按提交顺序单独运行）。有依赖关系的工作用 `await` 串行化。
- 用 `print(...)` 和/或顶层 `return <value>` 输出本次运行的答案；返回值必须是无损 JSON。只有你打印的内容和返回值会回到你这里——中间的工具结果永远不会进入对话，因此只提取你需要的部分。

可用的工具如下：
```

## 关键参数
- `code`：异步 Python 函数体（顶层 `await`/`return` 均可用）
- `description`：程序功能的简短总结
- `tools` / `ToolCallError`：运行时恰好绑定的两个名称
- `TypedDict`：声明中仅作静态桩的类，运行时不存在；参数必须以纯 `dict`/`list` JSON 值构造（`await tools.name({"field": 1})`），调用 `FooArgs(field=1)` 会抛 `NameError`
- `tools.name(args)` / `await tools["my-tool"](args)`：工具调用语法（普通调用 / 对特殊、保留、`_` 开头名称的下标访问）
- `asyncio.gather`：独立只读调用可重叠执行的并发机制（安全调用并发、变更调用按提交顺序串行）
- `print(...)` / 顶层 `return <value>`：结果输出方式，仅打印内容与返回值会回到模型
- 生成的 `TypedDict` 类、`Tools` 协议与 `tools: Tools` 单例（`renderToolsSdkPy` 输出）接在 "The available tools:" 之后

## Few-shot 示例
无（`await tools.name({"field": 1})`、`FooArgs(field=1)` 等为反例/语法示例，非完整 Few-shot 演示）

## 提示词链路
- 上游: 常量由 `renderToolsSdkPy(schemas, outputs)` 消费——先输出 `SDK_INSTRUCTIONS`，再按字典序生成每个工具的 `TypedDict` 类（嵌套类先于引用它的父类）与 `Tools` 协议方法，最终返回 `${SDK_INSTRUCTIONS}\n\n\`\`\`python\n${declaration}\n\`\`\``（第 817 行）；调用方为 `dsh-tools` 的 `sdkSection()`（`index.ts:875`），按调用作用域的可见工具（排除 `run_code` 自身）生成
- 下游: 作为 `tools:sdk` section 渲染进最终系统提示词；模型据此编写 `run_code` 程序并在程序内调用各 SDK 工具
- Section 注册: `name: 'tools:sdk'`，`order: 150`（`SDK_SECTION_ORDER`，位于 100-199 工具指导带内、各工具指导之后）；`renderToolsSdkPy` 由 `SDK_RENDERERS.python` 指向（`index.ts:62`）

## 相关代码上下文
`SDK_INSTRUCTIONS` 定义于 `packages/core/tools/src/py-types.ts:734-743`，注释为 "The fixed model-facing usage contract rendered above the declarations."（渲染在声明之上的固定模型可见使用契约）。`jsonSchemaToPy`（第 726-731 行）把统一 schema 映射为 Python 类型表达式：`object` 退化为 `dict[str, Any]`（命名 TypedDict 需要 `renderToolsSdkPy` 提供的渲染上下文）、`const`/`enum` → `Literal[...]`、`oneOf` → 联合、`array` → `list[T]`，不支持/畸形输入回退为 `Any`；类型注解仅作参考，Python 运行时不强制。与 TS 风味（`ts-types.ts`）并行，两者均强调无损 JSON 参数与「只有打印/返回的内容回到对话」。
