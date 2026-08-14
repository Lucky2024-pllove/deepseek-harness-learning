import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import promptsSidebar from './prompts-sidebar.mjs'

// GitHub Pages 部署时需设置 base 为仓库名，例如 '/deepseek-harness-learning-site/'
// 本地预览时保持 '/'。构建脚本会通过环境变量注入。
const base = process.env.VITEPRESS_BASE ?? '/'

export default withMermaid(
  defineConfig({
    title: 'DeepSeek Harness 学习站',
    description: 'DeepSeek Harness 项目拆解：76 个提示词 + 11 个技能 + 架构分析',
    lang: 'zh-CN',
    base,
    cleanUrls: true,
    lastUpdated: true,
    // 翻译文档内保留了一些指向原仓库文件的相对内链（如 ./terminology），
    // 这些内链在本站没有对应页面，放行以避免构建报错。
    ignoreDeadLinks: true,
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ],
    themeConfig: {
      logo: '/logo.svg',
      nav: [
        { text: '首页', link: '/' },
        { text: '技术分析报告', link: '/guide/analysis' },
        { text: '产品说明书', link: '/guide/product-guide' },
        { text: '提示词库', link: '/prompts/' },
        {
          text: '相关链接',
          items: [
            { text: 'GitHub 仓库', link: 'https://github.com/deepseek-ai/deepseek-harness' },
            { text: 'Cordis 插件框架', link: 'https://github.com/cordiverse/cordis' },
          ],
        },
      ],
      sidebar: {
        '/guide/': [
          {
            text: '学习文档',
            items: [
              { text: '技术分析报告', link: '/guide/analysis' },
              { text: '产品说明书', link: '/guide/product-guide' },
            ],
          },
        ],
        '/prompts/': [
          { text: '提示词总览', link: '/prompts/' },
          ...promptsSidebar,
        ],
      },
      outline: {
        label: '本页目录',
        level: [2, 3],
      },
      search: {
        provider: 'local',
        options: {
          locales: {
            zh: {
              translations: {
                button: {
                  buttonText: '搜索文档',
                  buttonAriaLabel: '搜索文档',
                },
                modal: {
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                  footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                  },
                },
              },
            },
          },
        },
      },
      docFooter: {
        prev: '上一页',
        next: '下一页',
      },
      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/deepseek-ai/deepseek-harness' },
      ],
      footer: {
        message: '基于 deepseek-harness 仓库的系统化拆解生成',
        copyright: 'MIT License · 分析日期 2026-08-14',
      },
    },
    // Mermaid 配置
    mermaid: {
      // 参考 https://mermaid.js.org/config/schema-docs/config.html
    },
    mermaidPlugin: {
      class: 'mermaid',
    },
  }),
)
