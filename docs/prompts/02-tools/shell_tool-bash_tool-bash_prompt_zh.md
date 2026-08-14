## 元信息
- 原文件位置: `packages/shell/tool-bash/src/index.ts:236-240`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:bash`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——bash 命令执行工具
- 调用场景: 插件 `apply` 阶段注册到系统提示词；该 section 常驻模型上下文，用于跨调用地指导模型如何解读 `bash` 工具的每次执行结果
- 来源分类: 生产代码

## 英文原文
```text
Check the [exit code: N] marker on every bash result; investigate failures before moving on.
```

## 中文翻译
```text
检查每次 bash 结果上的 [exit code: N] 标记；在继续下一步之前，先调查失败原因。
```

## 关键参数
- `[exit code: N]`：bash 工具结果中的退出码标记，为字面量格式，`N` 表示进程退出码（非零表示失败）；翻译中保持原样
- 该提示词本身无模板占位符；其指导的 `bash` 工具的主要参数（schema）包括：`command`（要执行的 bash 命令）、`description`（命令的简明描述）、`timeoutMs`（超时毫秒数）、`workdir`（工作目录）、`run_in_background`（是否后台运行，可选）、`sandbox_permissions`/`justification`（沙箱提权，可选）

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-bash` 插件的 `apply` 通过 `ctx.systemPrompt.section()` 静态注册，无运行时输入
- 下游: 注册进 `systemPrompt` 服务，与其他 section 一起按 `order` 排序渲染进最终系统提示词，供模型在调用 `bash` 工具前后阅读
- Section 注册: `name: 'tool:bash'`，`order: 105`（位于 100-199 工具指导带内），指导的工具为 `bash`

## 相关代码上下文
在 `apply` 函数中（`packages/shell/tool-bash/src/index.ts`），紧邻 `ctx.tools.register(defineTool({ name: 'bash', ... }))` 之前注册（第 236-240 行）。代码注释说明「跨调用的指导属于提示词，而不是单次调用的 schema 描述」（"Cross-call guidance belongs in the prompt rather than one-call schema prose."），即该提示词用于向模型传达跨调用、持续有效的执行结果解读规则。同文件还实现了沙箱提权审批（`approveBashEscalation`）与后台执行支持（`backgroundEnabled`）。
