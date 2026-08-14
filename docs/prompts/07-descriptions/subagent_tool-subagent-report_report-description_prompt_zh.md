# 提示词翻译文档：report 工具描述

## 元信息
- 原文件位置: `packages/subagent/tool-subagent-report/src/index.ts:67-73`
- 变量名称: `report` 工具的 `description`
- 功能模块: `@deepseek-ai/dsh-tool-subagent-report` — 子代理报告工具
- 调用场景: 作为 `report` 工具的 description 注入 continuable 子代理
- 来源分类: 生产代码

## 英文原文
```plaintext
Report selected content to the agent that started you. Call this once before you finish, with a self-contained final result, and earlier for progress or findings that change what that agent does next. That agent shares your workspace but does not automatically receive your transcript, tool output, or reasoning, so finishing your work is not itself a result. Reporting does not end your turn or finish your work, and only your direct parent receives it. A failed call may still have arrived, so do not blindly repeat it.
```

## 中文翻译
```plaintext
向启动你的那个智能体报告选定内容。在收尾前以自包含的最终结果调用一次；当阶段性进展或发现会改变那个智能体下一步该做什么时，也要更早地报告。那个智能体共享你的工作区，但不会自动收到你的转录、工具输出或推理，因此完成工作本身并不是结果。报告不会结束你的回合、也不会完成你的工作，且只有你的直接父代理能收到。失败的调用可能仍然已送达，因此不要盲目重复它。
```

## 关键参数
- `output` 参数：`Actionable content for your parent; summarize conclusions and reference relevant shared paths.`（给父代理的可执行内容；总结结论并引用相关共享路径）。

## Few-shot 示例
无

## 提示词链路
- 上游: `installReportTool`（`index.ts:49`）注册 report 工具（description 见 67-73 行）。
- 下游: 与 `tool:report` section 配套，指导子代理回传结果。

## 相关代码上下文
- 函数: `installReportTool`（`index.ts:49`）。
- 关联: `tool:report` section（`index.ts:54`）。
