## 元信息
- 原文件位置: `packages/shell/tool-pwsh/src/index.ts:245-250`
- 变量名称: 无（`ctx.systemPrompt.section({...})` 内联文本，section name 为 `tool:pwsh`）
- 功能模块: 工具使用指导层（Tool Usage Guidance）——PowerShell 命令执行工具
- 调用场景: 插件 `apply` 阶段注册到系统提示词；常驻模型上下文，指导模型解读 `pwsh` 工具的退出码与 Windows 平台被杀死进程的语义
- 来源分类: 生产代码

## 英文原文
```text
Non-zero exits are reported as `[exit code: N]` markers; investigate failures before moving on. On Windows a killed process settles as `[exit code: 1]` without a signal marker; treat a bare exit 1 after an interruption as a termination, not a command failure.
```

## 中文翻译
```text
非零退出会以 `[exit code: N]` 标记的形式报告；在继续下一步之前，先调查失败原因。在 Windows 上，被强杀的进程会以 `[exit code: 1]` 结束且不带信号标记；请把中断之后出现的裸 exit 1 视为进程终止，而不是命令失败。
```

## 关键参数
- `[exit code: N]`：退出码标记字面量，`N` 为进程退出码；保持原样不翻译
- `[exit code: 1]`：Windows 上被杀死进程的固定结束码字面量；保持原样不翻译
- 该提示词无模板占位符；其指导的 `pwsh` 工具主要参数（schema）包括：`command`（要执行的 PowerShell 命令）、`description`、`timeoutMs`、`workdir`、`run_in_background`（可选）、`sandbox_permissions`/`justification`（可选），与 `tool-bash` 刻意保持镜像（源码中 `jscpd:ignore` 注释注明 "deliberate mirror of dsh-tool-bash's parameter surface"）

## Few-shot 示例
无

## 提示词链路
- 上游: 由 `tool-pwsh` 插件的 `apply` 通过 `ctx.systemPrompt.section()` 静态注册，无运行时输入
- 下游: 注册进 `systemPrompt` 服务，按 `order` 排序渲染进最终系统提示词；模型在调用 `pwsh` 工具时据此正确解读 Windows 平台的结果语义
- Section 注册: `name: 'tool:pwsh'`，`order: 105`（与 `tool:bash` 并列，位于 100-199 工具指导带内），指导的工具为 `pwsh`

## 相关代码上下文
在 `apply` 函数中注册于 `ctx.tools.register(defineTool({ name: 'pwsh', ... }))` 之前（第 245-250 行）。该提示词补充了 bash 版本没有的 Windows 特有语义：Windows 没有 POSIX 信号机制，进程被强制终止时无法以信号标记上报，只能表现为 `[exit code: 1]`，因此模型不能把中断后的裸 exit 1 误判为命令本身的失败。同文件实现了 `approvePwshEscalation` 沙箱提权审批，且前台结果线格式与 `dsh-tool-bash` 按契约保持一致（consumers 必须两者都接受）。
