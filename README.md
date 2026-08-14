# DeepSeek Harness 学习站

基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 仓库系统化拆解产物搭建的 **VitePress 学习网站**，内容包括：

- **技术分析报告**（8 章，含 4 张 Mermaid 架构图）
- **产品说明书**（12 章面向非技术用户）
- **提示词中英对照库**（76 个模型可见提示词，按 9 大模块分类，含英文原文/中文翻译/关键参数/提示词链路）

## 本地开发

环境要求：Node.js ≥ 22、pnpm ≥ 9。

```sh
# 1. 安装依赖
pnpm install

# 2. 生成内容（从 ai_analysis 产物复制文档并生成侧边栏）
node scripts/build-content.mjs

# 3. 启动开发服务器
pnpm run docs:dev

# 4. 构建生产版本（输出到 docs/.vitepress/dist）
pnpm run docs:build

# 5. 本地预览构建产物
pnpm run docs:preview
```

## 单文件 HTML 版（零依赖、双击即开）

仓库根目录的 `index.html` 是一个**自包含的单文件版**，clone 下来后**双击就能用浏览器打开**，不需要安装 Node/pnpm、不需要构建、不需要联网。

- 适合技术小白：下载/clone 后双击 `index.html` 即可学习
- 包含全部内容：技术报告、产品说明书、76 个提示词（中英对照）
- 内置极简 Markdown 渲染 + 搜索 + 分组导航
- 注意：单文件版中架构图以代码块形式展示（不渲染为图形）；如需图形化的 Mermaid 架构图，请访问 GitHub Pages 在线版

重新生成单文件版：

```sh
node scripts/build-single-file.mjs
```

> 说明：`index.html` 是脚本生成的，修改内容后需重新运行上述命令。

## 内容来源

内容由 `lark-project-archive` 技能拆解生成，源分析产物位于：

```
E:\AI\开源项目拆解\deepseek-harness-master-ai_analysis\
├── AI_MODEL_USAGE_ANALYSIS.md     # 技术分析报告
├── PRODUCT_GUIDE.md               # 产品说明书
├── ROOT_OVERVIEW.md               # 概览
└── translated_prompts/            # 70 篇提示词翻译文档 + MANIFEST + INDEX
```

`scripts/build-content.mjs` 脚本负责：

1. 把技术分析报告、产品说明书复制到 `docs/guide/`
2. 把 70 篇提示词翻译文档按 9 大模块复制到 `docs/prompts/<模块>/`
3. 重写分析报告里指向提示词文档的相对链接为站点路径
4. 生成侧边栏配置 `docs/.vitepress/prompts-sidebar.mjs`

> ⚠️ `docs/prompts/` 和 `docs/.vitepress/prompts-sidebar.mjs` 是脚本生成的，不要手改；修改后重新运行 `node scripts/build-content.mjs` 即可。

## 部署到 GitHub Pages（读者零安装）

> 网站内容（`docs/` 目录）**已经生成好并随仓库提交**，云端只需安装依赖 + 构建，无需重新运行内容转换脚本。读者访问托管网址即可，完全不需要安装 Node/pnpm。

### 方式一：GitHub Actions（推荐，全自动）

1. 将本目录推到 GitHub 仓库的 `main` 分支
2. 在仓库 **Settings → Pages** 中，将 **Source** 设为 **GitHub Actions**
3. 推送后 Actions 自动安装依赖、构建、部署，完成后访问 `https://<用户名>.github.io/<仓库名>/`

`.github/workflows/deploy.yml` 已配置好，会自动根据仓库名设置 `base` 路径。

### 方式二：手动构建推送

```sh
$env:VITEPRESS_BASE='/<你的仓库名>/'
pnpm run docs:build
# 将 docs/.vitepress/dist 目录内容部署到 Pages
```

### base 路径说明

- **本地预览**：保持 `base: '/'`（默认），无需设置 `VITEPRESS_BASE`
- **GitHub Pages 项目站点**：`base` 必须是 `/<仓库名>/`，Actions 已自动注入
- **自定义域名**：`base` 保持 `'/'`

## 如何更新网站内容

网站内容来自拆解分析产物（`deepseek-harness-master-ai_analysis`），日常更新流程：

1. 修改 `E:\AI\开源项目拆解\deepseek-harness-master-ai_analysis\` 下的源文档
2. 本地运行 `node scripts/build-content.mjs` 重新生成 `docs/prompts/` 与 `docs/guide/`
3. 提交 `docs/` 变更并推送，Actions 自动重新部署

> 注意：`scripts/build-content.mjs` 里的源路径 `SRC` 指向本地 `ai_analysis` 目录，仅用于本地更新；云端部署不依赖该路径。

## 目录结构

```
deepseek-harness-learning-site/
├── .github/workflows/deploy.yml      # GitHub Actions 部署
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts                # VitePress 配置（Mermaid/搜索/导航/侧边栏）
│   │   └── prompts-sidebar.mjs       # 自动生成的提示词侧边栏
│   ├── index.md                      # 首页
│   ├── guide/
│   │   ├── analysis.md               # 技术分析报告
│   │   └── product-guide.md          # 产品说明书
│   ├── prompts/
│   │   ├── index.md                  # 提示词总览
│   │   └── 01-core/ … 09-results/    # 9 大模块，共 70 篇
│   └── public/logo.svg
├── scripts/build-content.mjs         # 内容转换脚本
└── package.json
```

## 技术栈

- [VitePress](https://vitepress.dev/) — 静态站点生成器
- [vitepress-plugin-mermaid](https://github.com/DiscreteTom/vitepress-plugin-mermaid) — Mermaid 图渲染
- VitePress 内置本地搜索（minisearch）
