// 生成单文件 HTML 版学习网站（零依赖、双击即开）
// 运行：node scripts/build-single-file.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DOCS = join(ROOT, 'docs')

// 模块分组（与 build-content.mjs 保持一致）
const MODULES = [
  { id: '01-core', label: '系统提示词核心层' },
  { id: '02-tools', label: '工具使用指导层' },
  { id: '03-context', label: '动态上下文注入' },
  { id: '04-long', label: '长指令提示词' },
  { id: '05-repair', label: '运行时修复提示词' },
  { id: '06-orchestration', label: '编排与多智能体提示词' },
  { id: '07-descriptions', label: '工具描述补遗' },
  { id: '08-interaction', label: '交互与钩子提示词' },
  { id: '09-results', label: '工具结果与定时提示' },
]

// 从 markdown 首行提取标题
function extractTitle(md) {
  const firstLine = md.split('\n')[0] ?? ''
  const m = firstLine.match(/^#\s*提示词翻译文档[：:]\s*(.+)$/)
  if (m) return m[1].trim()
  return firstLine.replace(/^#\s*/, '').trim() || '未命名'
}

// 收集内容
const groups = [
  {
    id: 'guide',
    label: '学习文档',
    items: [
      { id: 'analysis', title: '技术分析报告', md: readFileSync(join(DOCS, 'guide', 'analysis.md'), 'utf8') },
      { id: 'product-guide', title: '产品说明书', md: readFileSync(join(DOCS, 'guide', 'product-guide.md'), 'utf8') },
    ],
  },
]

for (const mod of MODULES) {
  const dir = join(DOCS, 'prompts', mod.id)
  const items = []
  for (const fname of readdirSync(dir)) {
    if (!fname.endsWith('.md')) continue
    const md = readFileSync(join(dir, fname), 'utf8')
    items.push({ id: `${mod.id}:${fname}`, title: extractTitle(md), md })
  }
  groups.push({ id: mod.id, label: mod.label, items })
}

// 内容表：id → markdown
const contents = {}
for (const g of groups) {
  for (const it of g.items) {
    contents[it.id] = it.md
  }
}

// 供渲染器使用的精简数据（不含 md 正文，正文单独放 contents）
const dataForScript = {
  groups: groups.map(g => ({ id: g.id, label: g.label, items: g.items.map(it => ({ id: it.id, title: it.title })) })),
  contents,
}

const json = JSON.stringify(dataForScript)

// 读取模板并注入数据
const template = readFileSync(join(__dirname, 'single-file-template.html'), 'utf8')
const output = template.replace('/*__DATA__*/', `const DATA = ${json};`)

const outPath = join(ROOT, 'index.html')
writeFileSync(outPath, output, 'utf8')
console.log(`[ok] 生成 ${outPath}`)
console.log(`     共 ${groups.length} 个分组、${Object.keys(contents).length} 篇内容`)
console.log(`     文件大小 ${(Buffer.byteLength(output) / 1024).toFixed(1)} KB`)
