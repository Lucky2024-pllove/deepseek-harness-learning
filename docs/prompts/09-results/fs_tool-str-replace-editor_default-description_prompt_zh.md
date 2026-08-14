# 提示词翻译文档：str_replace_editor 默认描述

## 元信息
- 原文件位置: `packages/fs/tool-str-replace-editor/src/index.ts:19-30`
- 变量名称: `DEFAULT_DESCRIPTION`
- 功能模块: `@deepseek-ai/dsh-tool-str-replace-editor` — 定制文件编辑工具
- 调用场景: 作为 `str_replace_editor` 工具的 description 注入模型（`config.description ?? DEFAULT_DESCRIPTION`）
- 来源分类: 生产代码

## 英文原文
```text
Custom editing tool for viewing, creating and editing files
* State is persistent across command calls and discussions with the user
* If `path` is a file, `view` displays the result of applying `cat -n`. If `path` is a directory, `view` lists non-hidden files and directories up to 2 levels deep
* The `create` command cannot be used if the specified `path` already exists as a file
* If a `command` generates a long output, it will be truncated and marked with `<response clipped>`

Notes for using the `str_replace` command:
* The `old_str` parameter should match EXACTLY one or more consecutive lines from the original file. Be mindful of whitespaces!
* If the `old_str` parameter is not unique in the file, the replacement will not be performed. Make sure to include enough context in `old_str` to make it unique
* The `new_str` parameter should contain the edited lines that should replace the `old_str`
```

## 中文翻译
```text
用于查看、创建和编辑文件的定制编辑工具
* 状态在命令调用与用户讨论之间持久保留
* 若 `path` 是文件，`view` 显示应用 `cat -n` 后的结果；若 `path` 是目录，`view` 列出最多 2 层的非隐藏文件与目录
* 若指定 `path` 已作为文件存在，则不能使用 `create` 命令
* 若 `command` 产生长输出，将被截断并标记 `<response clipped>`

使用 `str_replace` 命令的注意事项：
* `old_str` 参数应恰好匹配原文件中的一行或多行连续内容。注意空白字符！
* 若 `old_str` 参数在文件中不唯一，则不会执行替换。确保在 `old_str` 中包含足够的上下文使其唯一
* `new_str` 参数应包含用于替换 `old_str` 的编辑后行内容
```

## 关键参数
- 无 `{{variable}}` 占位符；`cat -n`、`view`、`create`、`str_replace`、`old_str`、`new_str`、`<response clipped>` 为字面量。

## Few-shot 示例
无

## 提示词链路
- 上游: `defineTool({ name: 'str_replace_editor', description: config.description ?? DEFAULT_DESCRIPTION, ... })`（`index.ts:422`）。
- 下游: 作为工具 Schema 的 description 注入模型，与 `tool:read`/`tool:write`/`tool:edit` section 配套。

## 相关代码上下文
- 常量: `DEFAULT_DESCRIPTION`（`index.ts:19`）、`TRUNCATED_MESSAGE`（`index.ts:17`，与 persistent bash 的截断标记相同）。
- 关联: `formatFileView`（`index.ts:136`，文件视图提示，见 file-view 翻译文档）。
