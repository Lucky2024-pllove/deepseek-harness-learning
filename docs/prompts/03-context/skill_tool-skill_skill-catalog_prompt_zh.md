# 提示词翻译文档

## 元信息
- 原文件位置: `packages/skill/tool-skill/src/index.ts:254-311`
- 变量名称: `renderCatalogMessage(entries)`（254-277）、`renderCatalogUpdate(entries)`（279-311）
- 功能模块: 技能目录注入（skill catalog）—— 把当前会话可用的 skill 清单以 `<system-reminder>` 形式注入模型
- 调用场景: 步骤监听器（step listener）在每次 agent 回合前对比目录摘要（digest）；首次发布用 `renderCatalogMessage`，目录变更后的替换发布用 `renderCatalogUpdate`。二者都是 `source.kind === 'skill-catalog'` 的 `UserMessage`（form: 'catalog'，update 时 `update: true`）。
- 来源分类: 生产代码

> 说明：两条消息合并为一份文档，分别标注。

## 英文原文

### renderCatalogMessage（`index.ts:254-277`）
```text
<system-reminder>
A skill is a reusable set of task-specific instructions. The following skills are available in this session:

<available_skills>
- `skill-name`: skill description
- `skill-name`: skill description
...
</available_skills>

If the user names a skill, or the task clearly matches a skill's description, call the `skill` tool with the exact skill name before taking task actions. Load all applicable skills, then follow their full instructions. This catalog contains summaries only; do not infer or follow a skill's instructions until it has been loaded.
A user may also invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool again for that skill.
</system-reminder>
```

### renderCatalogUpdate（`index.ts:279-311`）
```text
<system-reminder>
The available skill catalog changed. This complete catalog replaces every earlier available-skills list in this session:

<available_skills>
- `skill-name`: skill description
...
</available_skills>

[空目录时] No skills are currently available through the `skill` tool. Do not use names from earlier skill catalogs.
A user may still invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool for it.

[非空目录时] Use only names in this replacement catalog. If the user names a listed skill, or the task clearly matches its description, call the `skill` tool with the exact name before acting.
A user may also invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool again for that skill.
</system-reminder>
```

## 中文翻译

### renderCatalogMessage
```text
<system-reminder>
技能（skill）是一组可复用的、面向特定任务的指令。本会话当前可用的技能如下：

<available_skills>
- `技能名`：技能描述
- `技能名`：技能描述
...
</available_skills>

如果用户点名某个技能，或任务明显匹配某个技能的描述，请在采取任务行动之前，用准确的技能名调用 `skill` 工具。加载所有适用的技能，然后遵循它们的完整指令。本目录只包含摘要；在技能被加载之前，不要根据摘要推断或遵循其指令。
用户也可以直接调用某个技能；此时其 <skill_content> 块会出现在本对话中。请遵循它，并且不要再为该技能调用 `skill` 工具。
</system-reminder>
```

### renderCatalogUpdate
```text
<system-reminder>
可用技能目录已发生变化。这一完整目录取代本会话中之前的所有可用技能列表：

<available_skills>
- `技能名`：技能描述
...
</available_skills>

[空目录时] 当前没有通过 `skill` 工具可用的技能。不要使用早期技能目录中的名称。
用户仍可以直接调用某个技能；此时其 <skill_content> 块会出现在本对话中。请遵循它，并且不要为它调用 `skill` 工具。

[非空目录时] 只使用本替换目录中的名称。如果用户点名了列表中的某个技能，或任务明显匹配其描述，请在行动之前用准确的名称调用 `skill` 工具。
用户也可以直接调用某个技能；此时其 <skill_content> 块会出现在本对话中。请遵循它，并且不要再为该技能调用 `skill` 工具。
</system-reminder>
```

## 关键参数
- `<available_skills>` / `</available_skills>`、`<skill_content>`、`<system-reminder>`：伪 XML 结构标签，保持原样。
- `entries: SkillCatalogSource['entries']`：目录条目列表；每行由 `renderCatalogEntries`（`index.ts:319-321`）渲染为 `` - `name`: description ``，name 经 `isSkillName` 校验（不含可转义字符），description 经 `escapeText` 转义（伪 XML 转义属于该帧，不落库）。
- 目录摘要：`digestCatalogEntries` 对 `JSON.stringify([name, description])` 逐条做 SHA-256，用于判断是否需重发目录（`history.visibleDigest === digest` 时跳过）。
- `update: true`：区分替换目录与初始目录的 source 标记。

## Few-shot 示例
无（目录中的每条 `- \`name\`: description` 为动态生成行，非静态示例）

## 提示词链路
- 注入时机：步骤监听器（约 `index.ts:220-251`）在每次回合决策时执行 —— 若技能对当前 agent 可见则 `ctx.skills.snapshot(...)` 取快照，过滤出 `isModelInvocable` 的条目；摘要未变时不注入（或移除已存在的过期目录消息）；首次发布用 `renderCatalogMessage`，已发布过则用 `renderCatalogUpdate` 替换旧消息（`messages.map(...)` 按消息 id 替换）。
- 上游：`ctx.skills.snapshot({ cwd, signal, scope: agent })` 返回的技能快照（`complete: false` 时直接返回原决策，不注入）；`catalogDescriptionMaxLength` 限制描述长度。
- 下游：注入为 `UserMessage`（source.kind 'skill-catalog'）进入该回合消息列表；被移除/替换的目录消息从 `decision.messages` 中过滤掉。
- 空目录语义：若从未发布过且技能数为 0，则不注入任何目录消息（`!history.published && skills.length === 0` 分支）。

## 相关代码上下文
- 目录身份基于持久化的条目列表而非渲染散文（`index.ts:323-335` 注释）：围绕的 `<system-reminder>` 帧是写给模型的，不能决定是否需要重发。
- `readCatalogEntries`（`index.ts:348+`）从会话日志读取旧目录 source；不可读记录按「非本插件目录」处理而非抛错，避免拖垮会话后续回合。
