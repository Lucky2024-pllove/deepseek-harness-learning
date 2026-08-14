## 元信息
- 原文件位置: `packages/terminal/tool-terminal/src/index.ts:156-160`（section 文本在第 159 行）
- 变量名称: `ctx.systemPrompt.section({ name: 'tool:pty', order: 106, text: ... })` 的 `text` 字段
- 功能模块: 持久终端工具集（tool-terminal，六个模型面对终端工具）
- 调用场景: 插件加载时注册到系统提示词，作为跨调用使用指导，约束模型何时该用持久终端会话、何时该用一次性 shell 工具
- 来源分类: 生产代码

## 英文原文
```
Use a terminal session only when work needs persistent terminal state or interactive stdin; prefer shell/read/write/edit for bounded one-shot operations. Track every terminal session id and close sessions that no longer matter. An inferred_idle or timeout result does not prove the foreground command exited.
```

## 中文翻译
```
仅当工作需要持久化的终端状态或交互式标准输入（stdin）时才使用终端会话；对于有界的一次性操作，优先使用 shell/read/write/edit。跟踪每一个终端会话 id，并关闭不再需要的会话。inferred_idle 或 timeout 结果并不证明前台命令已经退出。
```

## 关键参数
- 无占位符，纯静态文本
- systemPrompt section 元数据：`name: 'tool:pty'`，`order: 106`

## Few-shot 示例
无

## 提示词链路
- 上游: 插件 `apply()` 中静态注册，无动态输入
- 下游: `ctx.systemPrompt.section(...)` 将该文本并入系统提示词，随每个模型请求进入上下文，与六个终端工具的 schema 描述共同指导工具选择
- 注入时机与 order: 插件加载时（apply，第 156-160 行），`order: 106`（与 bash/pwsh 工具的 `tool:bash`/`tool:pwsh` section order 105 相邻）

## 相关代码上下文
`tool-terminal/src/index.ts` `apply()`（第 146-399 行）：section 注册于第 156-160 行；随后注册 `terminal_open`/`terminal_send`/`terminal_read`/`terminal_signal`/`terminal_close`/`terminal_list` 六个工具；`DEFAULT_MAX_RESULT_BYTES = 256 * 1024`（第 30 行）限制单次完整结果。
