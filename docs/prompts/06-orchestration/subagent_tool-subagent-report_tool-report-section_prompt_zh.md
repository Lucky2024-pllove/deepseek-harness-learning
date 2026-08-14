# 提示词翻译文档：tool:report section（子代理报告指导）

## 元信息
- 原文件位置: `packages/subagent/tool-subagent-report/src/index.ts:54-62`
- 变量名称: `tool:report`（`childCtx.systemPrompt.section({ name: 'tool:report', order: REPORT_SECTION_ORDER, ... })` 注册）
- 功能模块: `@deepseek-ai/dsh-tool-subagent-report` — 子代理报告工具
- 调用场景: 在 continuable 子代理的子作用域内注册；指导子代理在收尾前用 report 工具交付自包含结果
- 来源分类: 生产代码

## 英文原文
```plaintext
Deliver your result with the report tool before you finish: call it once with a self-contained answer. The agent that started you shares your workspace but does not automatically receive your transcript, tool output, or reasoning, so a closing remark such as "done" leaves it nothing it can use. Report earlier as well whenever a partial finding changes what that agent should do next; reporting never ends your turn.
```

## 中文翻译
```plaintext
在收尾之前，用 report 工具交付你的结果：以自包含的答案调用它一次。启动你的那个智能体共享你的工作区，但不会自动收到你的转录、工具输出或推理过程，因此像"done"这样的收尾语不会给它留下任何可用的东西。每当阶段性发现会改变那个智能体下一步该做什么时，也要尽早报告；报告永远不会结束你的回合。
```

## 关键参数
- 无占位符。本 section 静态文本，注册于 REPORT_SECTION_ORDER（order 常量）。

## Few-shot 示例
无

## 提示词链路
- 上游: `installReportTool(childCtx, ctx, delivery)`（`index.ts:49`）在子代理创建窗口内先注册 section，再注册 report 工具。
- 下游: 进入子代理的 `PromptAssembly.sections`，指导子代理用 report 工具把结果回传给父代理。

## 相关代码上下文
- 函数: `installReportTool`（`index.ts:49`）。
- 关联工具: `report`（`defineTool`，`index.ts:65`）。
- 机制: 父代理与子代理共享工作区但不同享转录，report 工具是子代理回传结果的唯一通道；仅直接父代理能收到。
