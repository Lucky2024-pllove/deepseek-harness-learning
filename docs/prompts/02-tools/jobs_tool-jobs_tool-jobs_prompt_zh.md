## 元信息
- 原文件位置: `packages/jobs/tool-jobs/src/index.ts:263-267`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:jobs`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——后台任务跟踪工具集（`job_output` / `job_kill` / `job_list`）
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型如何管理自己启动的后台任务（跟踪、收尾、避免忙轮询）
- 来源分类: 生产代码

## 英文原文
```text
Track every background job id you start. You are notified in-session when a job finishes — do not busy-poll or sleep on one; keep working on independent steps and do not duplicate a running job's work. Before giving a final answer, collect every still-relevant job with job_output (set wait: true only when you are genuinely blocked on it), and job_kill jobs that stopped mattering.
```

## 中文翻译
```text
跟踪你启动的每一个后台任务 id。任务完成时你会收到会话内通知——不要对某个任务忙轮询或 sleep 等待；继续处理独立的步骤，不要重复正在运行的任务的工作。在给出最终答复之前，用 job_output 收集每一个仍然相关的任务（只有当你确实被它阻塞时才设置 wait: true），并用 job_kill 结束那些已不再重要的任务。
```

## 关键参数
- `job id`：后台任务标识符，由启动任务的工具返回，模型需逐个跟踪
- `job_output`：读取后台任务结果的工具名；`wait: true` 为其参数，仅当模型确实被该任务阻塞时才设置（等待有上限）
- `job_kill`：终止后台任务的工具名
- 无其他模板占位符；`[status: ...]` 等结果标记由 `job_output` 工具的 description 另行说明

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-jobs` 插件的 `apply` 通过 `ctx.systemPrompt.section()` 静态注册，无运行时输入
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型在管理后台任务生命周期时遵循此规则（代码注释："Producers may start work only while a controller is attached."，即 `ctx.jobs.attachController('tool-jobs')` 之后）
- Section 注册: `name: 'tool:jobs'`，`order: 106`（位于 100-199 工具指导带内，紧随 `tool:bash`/`tool:pwsh` 的 105 之后、产品 section 之前），指导的工具为 `job_output` / `job_kill` / `job_list`

## 相关代码上下文
注册位置在 `ctx.jobs.attachController('tool-jobs')`（第 260 行）之后、`ctx.tools.register`（`job_output`、`job_kill` 等）之前（第 263-267 行）。同文件实现了任务完成通知机制：`ctx.jobs.onJobDone` 监听任务结算，通过 `owner.inject` / `owner.followup` 把完成通知注入所属 Agent 的下一步收件箱（busy owner 排队、idle owner 唤醒），并有 `outputLimits` / `finalizeTaskContent` 对输出做字节上限截断（`fitWithSuffix`、`[output truncated]` 标记）。提示词与这些机制配合：模型无需轮询，因为会话内会自动收到完成通知。
