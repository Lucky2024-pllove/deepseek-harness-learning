# 提示词翻译文档：hooks 默认 deny/block 反馈（Claude Code + Codex）

## 元信息
- 原文件位置:
  - `packages/hooks/hooks-claude-code/src/index.ts:241,252,274`
  - `packages/hooks/hooks-codex/src/index.ts:229,240,267`
- 变量名称: 内联默认文本（`merged.reason ?? '<默认>'`）
- 功能模块: `@deepseek-ai/dsh-hooks-claude-code` / `@deepseek-ai/dsh-hooks-codex` — 外部编码助手的钩子桥接
- 调用场景: 当外部钩子（Claude Code / Codex）以 deny/block 决策返回但未提供原因时，作为默认工具反馈文本注入模型
- 来源分类: 生产代码

## 英文原文

三条默认文本（两个桥接包内容完全相同，仅位置不同）：

```text
blocked by PreToolUse hook
```

```text
blocked by PostToolUse hook
```

```text
continue: blocked by Stop hook
```

## 中文翻译

```text
被 PreToolUse 钩子阻止。
```

```text
被 PostToolUse 钩子阻止。
```

```text
继续：被 Stop 钩子阻止。
```

## 关键参数
- 无占位符。均为 `merged.reason ?? '<默认文本>'` 的回退值——钩子提供了 reason 时用 reason，未提供时用这三条默认文本。

## Few-shot 示例
无

## 提示词链路
- 上游: `runPoint('PreToolUse'/'PostToolUse'/'Stop', ...)` 执行外部钩子，返回 merged 决策。
- 下游: PreToolUse deny → 工具调用拒绝（reason）；PostToolUse deny → 工具结果 block（feedback 文本）；Stop deny → 强制续跑（steer 文本注入）。

## 相关代码上下文
- hooks-claude-code: `index.ts:241`（PreToolUse）、`252`（PostToolUse）、`274`（Stop）。
- hooks-codex: `index.ts:229`（PreToolUse）、`240`（PostToolUse）、`267`（Stop）。
- 机制: 这两个包桥接外部编码助手的钩子协议（Claude Code hooks / Codex hooks），把外部 deny/block 决策转译为本 harness 的工具决策。
