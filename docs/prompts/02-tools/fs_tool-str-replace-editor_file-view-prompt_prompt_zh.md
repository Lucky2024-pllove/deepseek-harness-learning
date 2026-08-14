## 元信息
- 原文件位置: `packages/fs/tool-str-replace-editor/src/index.ts:146`（前缀模板），`view_range` 后缀追加于第 177 行
- 变量名称: `formatFileView(path, content, maxOutputChars, viewRange?)` 中的 `prompt` 模板
- 功能模块: 字符串替换编辑器工具（str_replace_editor，文件系统能力缝的模型面对 Consumer）
- 调用场景: `view` 命令读取文件后，生成带行号的文件内容视图，作为模型可见输出
- 来源分类: 生产代码

## 英文原文

### 模板源码（第 146 行 + 第 177 行后缀）
```
Here's the content of ${path} with line numbers (which has a total of ${allLines.length} lines)[ with view_range=[${initialLine}, ${finalLine}]]
```

### 完整组装形态
```
Here's the content of <path> with line numbers (which has a total of <N> lines)[ with view_range=[<start>, <end>]]:
<numbered lines>
```

## 中文翻译
```
这是 <path> 的内容，带有行号（该文件共 <N> 行）[，view_range=[<起始行>, <结束行>]]：
<带行号的内容>
```

## 关键参数
- `${path}` — 目标文件显示路径（`target.displayPath`）
- `${allLines.length}` — 文件总行数
- `${initialLine}` / `${finalLine}` — `view_range` 的起止行号；`finalLine === -1` 表示从 `initialLine` 到文件末尾；未提供 `view_range` 时显示完整文件且无该后缀
- `${numbered}` — 从 `initialLine` 起逐行编号的文本，行号 6 位宽度右对齐 + 两个空格 + 行内容（`String(initialLine + index).padStart(6, ' ')`）
- 结尾 `:\n` 与截断：整段经 `maybeTruncate` 处理，超过 `maxOutputChars`（默认 16000 字符）时附加 `<response clipped><NOTE>...` 截断标记

## Few-shot 示例
无（`DEFAULT_DESCRIPTION` 中含 str_replace 使用说明与截断示例，属于工具 description，不属于本视图提示词）

## 提示词链路
- 上游: `viewPath()`（第 216-237 行）读取文件文本后调用 `formatFileView(target.displayPath, content, maxOutputChars, viewRange)`
- 下游: 返回字符串作为 `view` 命令的工具结果文本（`output.schema: {type:'string'}`），直接进入模型请求；`ctx.emit('fs/observed', ...)` 记录文件观察事件
- 注入时机与 order: 工具执行结果通道，非 `systemPrompt.section` 注入，无 order。目录路径走 `listDirectory`（`Here're the files and directories up to 2 levels deep ...`，第 213 行），与文件视图为两条分支

## 相关代码上下文
`tool-str-replace-editor/src/index.ts`：`formatFileView` 定义于第 136-183 行；`maybeTruncate`（第 32-36 行）与 `TRUNCATED_MESSAGE`（第 17 行）；`view_range` 校验在函数内完成（第 147-177 行，含 `finalLine !== -1 && finalLine < initialLine` 等错误）；`viewPath` 经 `statExisting` 区分文件/目录/缺失路径。
