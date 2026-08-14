## 元信息
- 原文件位置: `packages/core/tools/src/index.ts:58`（注册处：第 855-863 行 `collapseSection()`）
- 变量名称: `CODE_ONLY_INSTRUCTION`
- 功能模块: 工具使用指导层（Tool Usage Guidance）——Code Mode（代码模式）下的工具调用坍缩规则声明
- 调用场景: 在 Code Mode 生效的作用域（`modeFor(scope) === 'code'`）注册为 section `tools:code-only`；模型在 Code Mode 下只能直接调用 `run_code`，此提示词在模型读到各工具指导（100-199 带）之前先声明该规则，避免模型发出原生工具调用而收到 `UNKNOWN_TOOL`
- 来源分类: 生产代码

## 英文原文
```text
`run_code` is the only tool you can call directly — a tool call naming any other tool fails. Reach every tool the SDK declares below from inside the program.
```

## 中文翻译
```text
`run_code` 是你唯一可以直接调用的工具——命名任何其他工具的工具调用都会失败。请从程序内部调用下面 SDK 声明的每一个工具。
```

## 关键参数
- `${RUN_CODE_NAME}`：代码拼接占位符（非模型可见），值为 `'run_code'`（定义于 `code-mode.ts:20`）；提示词实际渲染时插值为 `` `run_code` ``
- `SDK`：下文渲染的 `tools:sdk` section 中声明的工具集（由 `sdkSchemas` 按调用作用域的可见工具生成）
- 提示词本身无其他模板占位符

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `dsh-tools` 的 `collapseSection()` 私有方法生成 section 注册（`{ name: 'tools:code-only', order: COLLAPSE_SECTION_ORDER, text: context => this.modeFor(context.scope) === 'code' ? CODE_ONLY_INSTRUCTION : '' }`，第 855-863 行）；文本渲染函数与执行器拒绝工具调用所用的谓词完全相同（"The SAME predicate the executor denies by"）
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型在 Code Mode 下据此只调用 `run_code`，其他工具从程序内部通过 SDK 调用
- Section 注册: `name: 'tools:code-only'`，`order: 99`（`COLLAPSE_SECTION_ORDER`，位于 100-199 工具指导带**之前**，即 person 段之后、各工具指导之前）；在 `both` 模式下渲染为空（原生调用在该模式下可执行，规则不成立）；指导的工具为 `run_code`（Code Mode 呈现传输通道）

## 相关代码上下文
`CODE_ONLY_INSTRUCTION`（`packages/core/tools/src/index.ts:58`）是模板字符串常量，注释说明：一条模型只能通过「被拒绝」才能发现的规则，是它纠正得太晚的规则，因此要在提示词中直接命名后果（调用失败）与出路（在程序内部调用）。`collapseSection()` 与 `sdkSection()` 注册于同一位置（第 835 行附近），后者为 `tools:sdk`（`order: 150`）。执行器侧：`run_code` 名称保留（第 1054-1055 行注册时报错），`tools.restrict()` 不能点名 `run_code`（第 1085-1086 行），Code Mode 下 `name !== RUN_CODE_NAME` 的工具调用被拒绝并提示 "only \`run_code\` is callable directly — call \`{name}\` from inside a \`run_code\` program instead"（第 1441 行）。
