# DeepSeek Harness 学习站

基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 仓库系统化拆解产物搭建的学习网站，面向想了解「AI Agent 框架如何工作」的开发者与爱好者。

<p align="center">
  <a href="https://Lucky2024-pllove.github.io/deepseek-harness-learning/">
    <img src="https://img.shields.io/badge/🚀-开始学习-4e83fd?style=for-the-badge" alt="开始学习">
  </a>
</p>

> **不安装任何东西、点一下就能学 👆** —— 也可以 clone 后双击根目录 `index.html` 离线学习。

- **GitHub 仓库**：https://github.com/Lucky2024-pllove/deepseek-harness-learning

## 内容一览

- **技术分析报告**（8 章，含 4 张 Mermaid 架构图）
- **产品说明书**（12 章面向非技术用户）
- **提示词中英对照库**（76 个模型可见提示词，按 9 大模块分类，含英文原文 / 中文翻译 / 关键参数 / 提示词链路）

> 说明：76 个是提示词**条目数**；部分文档合并了同模块的多个条目，因此翻译文档共 **70 篇**。

## 如何使用（读者看这里）

这个网站有**两种打开方式**，任选其一即可，都**不需要安装任何东西**：

### 方式 A：在线版（推荐，图形化架构图）

点下方按钮，或访问 GitHub Pages 网址：

```
https://Lucky2024-pllove.github.io/deepseek-harness-learning/
```

- ✅ 点开即看，无需下载，手机/电脑都能访问
- ✅ 架构图渲染为可交互图形（Mermaid）
- ✅ 内置中文全文搜索
- ✅ 无需任何安装

### 方式 B：单文件版（离线，双击即开）

下载或 clone 本仓库后，**双击根目录的 `index.html`**，浏览器直接打开即可学习。

- ✅ 零依赖、零构建、零联网
- ✅ 内置搜索 + 分组导航 + Markdown 渲染
- ⚠️ 架构图以代码块展示（不渲染为图形）

> ⚠️ **如果在线版网址打不开（404）**，说明在线版**尚未部署成功**。原因与解决见下方「部署到 GitHub Pages」一节——通常是因为仓库的 **Settings → Pages → Source** 还没有设为 **GitHub Actions**，或部署后需要等 1~2 分钟。


---

## 维护者指南（普通读者可跳过）

> 以下内容仅用于「修改网站内容 / 二次开发 / 部署」，读者学习无需关注。

### 本地开发

环境要求：Node.js ≥ 22、pnpm ≥ 9。

```sh
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（热更新）
pnpm run docs:dev

# 3. 构建生产版本（输出到 docs/.vitepress/dist）
pnpm run docs:build

# 4. 本地预览构建产物
pnpm run docs:preview
```

### 内容如何组织

网站内容由 `scripts/build-content.mjs` 从源分析产物生成：

```
E:\AI\开源项目拆解\deepseek-harness-master-ai_analysis\
├── AI_MODEL_USAGE_ANALYSIS.md     # 技术分析报告
├── PRODUCT_GUIDE.md               # 产品说明书
├── ROOT_OVERVIEW.md               # 概览
└── translated_prompts/            # 70 篇提示词翻译文档 + MANIFEST + INDEX
```

脚本负责：① 复制报告与说明书到 `docs/guide/`；② 把 70 篇提示词按 9 大模块复制到 `docs/prompts/`；③ 重写提示词相对链接；④ 生成侧边栏 `docs/.vitepress/prompts-sidebar.mjs`。

> ⚠️ `docs/prompts/` 和 `docs/.vitepress/prompts-sidebar.mjs` 是脚本生成的，勿手改；更新后重跑脚本即可。

### 更新网站内容

```sh
# 1. 修改源分析产物（仅维护者本地的 ai_analysis 目录）
# 2. 重新生成内容与侧边栏
node scripts/build-content.mjs

# 3. 重新生成单文件 HTML 版
node scripts/build-single-file.mjs

# 4. 提交并推送，Actions 自动重新部署
```

> 注意：`scripts/build-content.mjs` 中的源路径 `SRC` 指向维护者本地的 `ai_analysis` 目录，仅用于本地更新；云端部署与单文件版均不依赖该路径。

### 部署到 GitHub Pages

已配置 `.github/workflows/deploy.yml`，全自动部署。**完整开启步骤**：

1. 将本仓库推到 GitHub `main` 分支（已完成）
2. 打开仓库 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**（关键一步！）
3. 回到仓库 **Actions** 页，确认 `Deploy VitePress site to Pages` 工作流跑完且显示绿色 ✓
4. 等 1~2 分钟，访问 `https://Lucky2024-pllove.github.io/deepseek-harness-learning/`

> 如果 Actions 里看不到工作流或之前失败过：先在 Settings → Pages 完成第 2 步，再回到 Actions 页对工作流点 **Re-run all jobs** 重新运行。

**base 路径说明**：

| 场景 | `base` 设置 |
|------|-------------|
| 本地预览 | `'/'`（默认，无需设置） |
| GitHub Pages 项目站点 | `/<仓库名>/`（Actions 已自动注入） |
| 自定义域名 | `'/'` |

> 本项目仓库名为 `deepseek-harness-learning`，Actions 会自动把 `base` 设为 `/deepseek-harness-learning/`，无需手动配置。

## 目录结构

```
deepseek-harness-learning-site/        # 本地目录名（GitHub 仓库名为 deepseek-harness-learning）
├── index.html                          # 单文件 HTML 版（双击即开）
├── .github/workflows/deploy.yml        # GitHub Actions 部署
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts                  # VitePress 配置（Mermaid/搜索/导航/侧边栏）
│   │   └── prompts-sidebar.mjs         # 自动生成的提示词侧边栏
│   ├── index.md                        # 首页
│   ├── guide/
│   │   ├── analysis.md                 # 技术分析报告
│   │   └── product-guide.md            # 产品说明书
│   ├── prompts/
│   │   ├── index.md                    # 提示词总览
│   │   └── 01-core/ … 09-results/      # 9 大模块，共 70 篇
│   └── public/logo.svg
├── scripts/
│   ├── build-content.mjs               # 内容转换脚本（生成 docs/prompts + 侧边栏）
│   ├── build-single-file.mjs           # 单文件 HTML 生成脚本
│   └── single-file-template.html       # 单文件 HTML 模板
└── package.json
```

## 技术栈

- [VitePress](https://vitepress.dev/) — 静态站点生成器
- [vitepress-plugin-mermaid](https://github.com/DiscreteTom/vitepress-plugin-mermaid) — Mermaid 图渲染
- VitePress 内置本地搜索（minisearch）

## 许可证

本站内容基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（MIT License）的拆解分析生成。
