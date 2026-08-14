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

// 从翻译文档提取有辨识度的标题
// 优先级：① section name / 变量名 → ② 首行"提示词翻译文档：xxx" → ③ 文件名"最后一段"（最精确）→ ④ 功能模块
function extractTitle(md, fname) {
  const lines = md.split('\n')
  // ① 元信息 - 变量名称（优先 section name）
  const varLine = lines.find(l => /^-\s*变量名称/.test(l.trim()))
  if (varLine) {
    const sn = varLine.match(/section\s*(?:name|名)\s*为\s*`?([A-Za-z][A-Za-z0-9_:.-]{0,50})`?/)
    if (sn && !/ctx\.|\{\.\.\.\}/.test(sn[1])) return sn[1].trim()
    // 函数/常量名：去掉参数括号
    const fn = varLine.match(/`([A-Za-z_][A-Za-z0-9_]{2,50})\(/)
    if (fn) return fn[1].trim()
    const vm = varLine.match(/`([A-Za-z_][A-Za-z0-9_]{2,50})`/)
    if (vm && !/^无/.test(varLine.trim())) {
      // 变量名后的语言风味说明（如 `SDK_INSTRUCTIONS`（TypeScript 风味））追加为后缀
      const flavor = varLine.match(/（([A-Za-z]+) 风味）|\(([A-Za-z]+) flavor\)/)
      const lang = flavor ? (flavor[1] ?? flavor[2]) : ''
      if (lang && /^(TypeScript|Python|TS|PY)$/i.test(lang)) return vm[1] + ' (' + lang + ')'
      return vm[1].trim()
    }
  }
  // ② 首行"提示词翻译文档：xxx"
  const firstLine = lines[0] ?? ''
  const m = firstLine.match(/^#\s*提示词翻译文档[：:]\s*(.+)$/)
  if (m) return m[1].trim()
  // ③ 文件名最后一段（如 tool-pty、time-context、goal-round-prompt）
  const base = (fname || '').replace(/_prompt_zh\.md$/, '')
  const segs = base.split('_').filter(s => !/^(core|shell|fs|web|context|session|goal|guard|workflow|subagent|skill|interaction|sandbox|plan|todo|jobs|lsp|terminal|compaction|extensions|bundle|boot|client|schedule|session-query|hooks|docs|i18n)$/.test(s))
  if (segs.length >= 1) {
    let t = segs[segs.length - 1].replace(/-/g, ' ').replace(/^tool /, 'tool:')
    // SDK_INSTRUCTIONS 的 TS/Py 变体加语言后缀区分
    if (/sdk-instructions-(ts|py)/.test(base)) {
      const lang = /sdk-instructions-(ts|py)/.exec(base)[1].toUpperCase()
      t = 'SDK_INSTRUCTIONS (' + lang + ')'
    }
    return t
  }
  // ④ 功能模块
  const modLine = lines.find(l => /^-\s*功能模块/.test(l.trim()))
  if (modLine) {
    const mm = modLine.match(/`([A-Za-z][A-Za-z0-9_:.-]{0,40})`/)
    if (mm && !/ctx\.|systemPrompt|\.\.\./.test(mm[1])) return mm[1].trim()
  }
  return '未命名'
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
    // 去掉首行 "# 提示词翻译文档（：xxx）"，正文从"元信息"开始（侧边栏已有标题）
    const cleanMd = md.replace(/^#\s*提示词翻译文档[^\n]*\n+/, '')
    items.push({ id: `${mod.id}:${fname}`, title: extractTitle(md, fname), md: cleanMd })
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
// 防止内嵌内容中的 </script> 提前截断 <script> 块（浏览器 HTML 解析规则）
const safeJson = json.replace(/<\/script>/gi, '<\\/script>')

// 读取模板并注入数据
const template = readFileSync(join(__dirname, 'single-file-template.html'), 'utf8')
const output = template.replace('/*__DATA__*/', `const DATA = ${safeJson};`)

const outPath = join(ROOT, 'index.html')
writeFileSync(outPath, output, 'utf8')
console.log(`[ok] 生成 ${outPath}`)
console.log(`     共 ${groups.length} 个分组、${Object.keys(contents).length} 篇内容`)
console.log(`     文件大小 ${(Buffer.byteLength(output) / 1024).toFixed(1)} KB`)
