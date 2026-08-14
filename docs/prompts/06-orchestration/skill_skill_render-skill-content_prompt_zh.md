# 提示词翻译文档：renderSkillContent（技能内容框架）

## 元信息
- 原文件位置: `packages/skill/skill/src/index.ts:171-184`
- 变量名称: `renderSkillContent(skill)`
- 功能模块: `@deepseek-ai/dsh-skill` — 技能注册与渲染
- 调用场景: 当模型调用 `skill` 工具加载技能，或用户以 `/skill-name` 显式调用技能时，把技能正文渲染为 `<skill_content>` 框架注入
- 来源分类: 生产代码

## 英文原文
```plaintext
<skill_content name="<name>">
<skill_resources>
Base directory for this skill: <path>
Resolve relative paths mentioned by this skill against the base directory before using them. Load referenced resources only as needed.
</skill_resources>

<skill_instructions>
<skill.content 正文，原样嵌入>
</skill_instructions>
</skill_content>
```

（`resourceHint` 按 resourceBase 类型分三种：directory / url / opaque，均附"仅按需加载引用资源"提示。）

## 中文翻译
```plaintext
<skill_content name="<名称>">
<skill_resources>
本技能的基目录：<路径>
使用本技能提到的相对路径前，请相对于该基目录解析。仅按需加载引用的资源。
</skill_resources>

<skill_instructions>
<技能正文，原样嵌入>
</skill_instructions>
</skill_content>
```

## 关键参数
- `${escapeAttr(skill.name)}` / `${escapeText(...)}`：技能名与资源提示经转义防注入。
- 技能正文 `skill.content` 原样嵌入（技能是受信任的本地内容）。

## Few-shot 示例
无

## 提示词链路
- 上游: `skill` 工具 execute（`tool-skill/src/index.ts`）或用户显式 `/skill-name` 调用（`tool-skill` 的 agent/pre-step 钩子）。
- 下游: 渲染结果作为工具结果文本或注入消息进入模型历史，供模型遵循技能指令。

## 相关代码上下文
- 函数: `renderSkillContent`（`skill/src/index.ts:171`）、`renderResourceHint`（`skill/src/index.ts:186`）。
- 关联: `tool-skill` 的 catalog（skill 目录 system-reminder）与 invocation（`<skill_content>` 注入）。
