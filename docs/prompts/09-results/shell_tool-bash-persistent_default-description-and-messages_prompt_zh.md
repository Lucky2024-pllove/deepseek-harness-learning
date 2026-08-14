# 提示词翻译文档：持久 bash 工具描述与结果消息

## 元信息
- 原文件位置: `packages/shell/tool-bash-persistent/src/index.ts:15-17, 25`
- 变量名称: `TRUNCATED_MESSAGE`（15）、`LOST_PREFIX_MESSAGE`（16）、`SHELL_RESET_MESSAGE`（17）、`DEFAULT_DESCRIPTION`（25）
- 功能模块: `@deepseek-ai/dsh-tool-bash-persistent` — 持久 bash 工具（owner 隔离的 PTY）
- 调用场景: `DEFAULT_DESCRIPTION` 作为工具 description 注入模型；三条消息作为工具结果文本（截断标记/滚动缓冲丢失前缀/shell 重置通知）注入模型
- 来源分类: 生产代码

## 英文原文

### DEFAULT_DESCRIPTION（`index.ts:25`）
```text
Run commands in a persistent bash shell. State, including the current directory and exported environment variables, persists across calls for this agent.
```

### TRUNCATED_MESSAGE（`index.ts:15`）
```text
<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
```

### LOST_PREFIX_MESSAGE（`index.ts:16`）
```text
<response clipped><NOTE>The beginning of this command output was dropped by the terminal scrollback limit. The following text is the earliest retained output.</NOTE>
```

### SHELL_RESET_MESSAGE（`index.ts:17`）
```text
The persistent bash shell was reset; the next bash call starts from the workspace with a fresh current directory and environment.
```

## 中文翻译

### DEFAULT_DESCRIPTION
```text
在持久化的 bash shell 中运行命令。状态（包括当前目录与导出的环境变量）跨调用为该智能体保留。
```

### TRUNCATED_MESSAGE
```text
<response clipped><NOTE>为节省上下文，本文件只有部分内容已显示给你。你应当先用 `grep -n` 在文件内搜索，以找到你要找内容的行号，然后再重试本工具。</NOTE>
```

### LOST_PREFIX_MESSAGE
```text
<response clipped><NOTE>此命令输出的开头部分已被终端滚动缓冲上限丢弃。以下文本是最早保留的输出。</NOTE>
```

### SHELL_RESET_MESSAGE
```text
持久化 bash shell 已被重置；下一次 bash 调用将从工作区以全新的当前目录和环境开始。
```

## 关键参数
- 无 `{{variable}}` 占位符；`<response clipped>` / `<NOTE>` 为模型可见标记标签。

## Few-shot 示例
无

## 提示词链路
- 上游: `DEFAULT_DESCRIPTION` 作为 `defineTool` 的 description（`config.description ?? DEFAULT_DESCRIPTION`）；三条消息在工具 execute/结果渲染时按需追加到输出文本。
- 下游: 作为工具 description 或结果文本注入模型，告知模型持久 shell 语义与截断/重置情况。

## 相关代码上下文
- 常量: `TRUNCATED_MESSAGE` / `LOST_PREFIX_MESSAGE` / `SHELL_RESET_MESSAGE` / `DEFAULT_DESCRIPTION`（`index.ts:15-25`）。
- `SHELL_PROMPT = '__DSH_PERSISTENT_BASH_PROMPT__ '`（18 行）为协议常量（非模型提示）。
- 机制: 持久 bash 走 owner 隔离的 PTY seam，状态跨调用保留，与普通 bash（每次新 shell）相反。
