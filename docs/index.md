---
layout: home
hero:
  name: DeepSeek Harness
  text: 项目拆解学习站
  tagline: 一个"一切皆插件"的 AI Agent 框架 —— 76 个提示词 · 11 个技能 · 深度架构分析
  actions:
    - theme: brand
      text: 开始学习
      link: /guide/analysis
    - theme: alt
      text: 浏览提示词库
      link: /prompts/
features:
  - icon: 📊
    title: 技术分析报告
    details: 8 章深度分析：架构与数据流、提示词分类、LLM 应用场景、工具清单、上下文工程，含 4 张架构图
    link: /guide/analysis
  - icon: 📖
    title: 产品说明书
    details: 12 章面向非技术用户的使用指南：快速开始、模块介绍、配置、常见问题、术语表
    link: /guide/product-guide
  - icon: 🧩
    title: 提示词中英对照库
    details: 76 个模型可见提示词，按 9 大模块分类，每个含英文原文、中文翻译、关键参数与链路
    link: /prompts/
  - icon: 🤖
    title: 多智能体架构
    details: subagent 委托、workflow 编排、goal 循环、Ralph fresh-agent 迭代 —— 完整的 Agent 协作拓扑
    link: /guide/analysis#_7-5-多-agent-协作拓扑
---

## 关于这个项目

DeepSeek Harness（`dsh`）是 DeepSeek AI 开发的开源 Agent Harness，采用"**一切皆插件（everything is a plugin）**"架构，基于 vendored [Cordis](https://github.com/cordiverse/cordis) 插件系统构建。

它驱动着 DeepSeek 的 Web GUI（默认 `http://127.0.0.1:3080`），同时支持 headless 命令行与 ACP 自动化服务器三种运行形态。

::: tip 项目拆解结论
- **76 个模型可见提示词** + 11 个 Agent 技能 + 约 21 个工具定义
- 核心模式：**多智能体框架 / AI Agent 平台**
- 提示词工程特点：模块化 section 组装、动态上下文快照、KV 缓存对齐压缩
:::

## "一切皆插件"架构

核心 Harness 提供装配骨架（agent-loop、system-prompt 组装、LLM 调用、会话管理），**能力全部以插件形式按需挂载**——文件系统、shell、子代理、工作流、技能、压缩等都是插件插槽上的一个模块。

```mermaid
graph LR
    subgraph harness["核心 Harness（装配骨架）"]
        loop["agent-loop 代理循环"]
        sp["system-prompt 组装器"]
        llm["llm 服务定义层"]
        sess["session 会话"]
    end
    slot1["插件: fs/shell/web"] --- harness
    slot2["插件: subagent/workflow"] --- harness
    slot3["插件: skill/compaction"] --- harness
    slot4["插件: goal/ralph/…"] --- harness
```

## 整个系统流程图

从用户输入到模型响应、再到工具执行的完整回路。LLM 是循环的驱动者：它决定调用哪个工具、根据工具结果决定继续还是结束。

```mermaid
graph TD
    A["用户输入"] --> B["agent-loop 组装请求"]
    B --> C["system-prompt 渲染 section/context/tools"]
    C --> D["llm.stream 流式调用"]
    D --> E{"模型响应"}
    E -->|"工具调用"| F["tools.execute 执行工具"]
    F --> G["结果回填会话"]
    G --> B
    E -->|"最终文本"| H["返回用户"]
```

## 学习路径建议

1. **入门**：先读 [产品说明书](/guide/product-guide)，了解它能做什么、怎么跑起来
2. **深入**：再读 [技术分析报告](/guide/analysis)，理解架构与数据流
3. **精研**：按模块浏览 [提示词库](/prompts/)，逐条对照英文原文与中文翻译
4. **实践**：回到源码仓库，对照 `packages/core/system-prompt` 理解组装机制

## 内容来源

本站内容由 `lark-project-archive` 技能对 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 仓库的系统化拆解生成。
