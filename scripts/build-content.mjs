// 内容转换脚本：把 ai_analysis 产物组织进 VitePress docs 目录
// 运行：node scripts/build-content.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = 'E:\\AI\\开源项目拆解\\deepseek-harness-master-ai_analysis'
const DOCS = join(ROOT, 'docs')

// 9 个提示词模块（对应飞书归档），每个模块列出源文件名
// 顺序即侧边栏顺序
const MODULES = [
  {
    id: '01-core',
    label: '系统提示词核心层',
    files: [
      'core_system-prompt_harness-identity_prompt_zh.md',
      'core_system-prompt_deployment-persona_prompt_zh.md',
      'core_system-prompt_runtime-context-envelope_prompt_zh.md',
      'boot_app-boot_harness-source_prompt_zh.md',
      'bundle_web-app_web-surface_prompt_zh.md',
    ],
  },
  {
    id: '02-tools',
    label: '工具使用指导层',
    files: [
      'shell_tool-bash_tool-bash_prompt_zh.md',
      'shell_tool-pwsh_tool-pwsh_prompt_zh.md',
      'jobs_tool-jobs_tool-jobs_prompt_zh.md',
      'lsp_tool-lsp_lsp-prompt_prompt_zh.md',
      'fs_tool-fs_tool-read_prompt_zh.md',
      'fs_tool-fs_tool-write_prompt_zh.md',
      'fs_tool-fs_tool-edit_prompt_zh.md',
      'fs_tool-fs-search_tool-grep_prompt_zh.md',
      'fs_tool-fs-search_tool-glob_prompt_zh.md',
      'web_tool-web_tool-web-search_prompt_zh.md',
      'web_tool-web_tool-web-fetch_prompt_zh.md',
      'client_ui-deliverables_file-reference_prompt_zh.md',
      'core_tools_code-only-instruction_prompt_zh.md',
      'core_tools_sdk-instructions-ts_prompt_zh.md',
      'core_tools_sdk-instructions-py_prompt_zh.md',
      'shell_tool-bash_bash-description_prompt_zh.md',
      'shell_tool-pwsh_pwsh-description_prompt_zh.md',
      'terminal_tool-terminal_tool-pty_prompt_zh.md',
      'fs_tool-str-replace-editor_file-view-prompt_prompt_zh.md',
    ],
  },
  {
    id: '03-context',
    label: '动态上下文注入',
    files: [
      'sandbox_sandbox-policy_render-policy-context_prompt_zh.md',
      'interaction_user-approval_approval-policy_prompt_zh.md',
      'subagent_subagent_delegation-context_prompt_zh.md',
      'context_agent-instructions_workspace-context_prompt_zh.md',
      'skill_tool-skill_skill-catalog_prompt_zh.md',
      'context_time-context_time-context_prompt_zh.md',
      'context_tmux-context_tmux-context_prompt_zh.md',
    ],
  },
  {
    id: '04-long',
    label: '长指令提示词',
    files: [
      'extensions_tool-cordis_cordis-system-prompt_prompt_zh.md',
      'compaction_compaction-basic_compaction-instruction_prompt_zh.md',
      'compaction_compaction-basic_checkpoint-preamble_prompt_zh.md',
      'session_session-title-llm_session-title-prompt_prompt_zh.md',
      'goal_goal-round-driver_goal-round-prompt_prompt_zh.md',
      'workflow_tool-ralph_ralph-round-prompt_prompt_zh.md',
      'guard_repeat-tool-reminder_gentle-reminder_prompt_zh.md',
      'guard_repeat-tool-reminder_detailed-reminder_prompt_zh.md',
      'docs_i18n_translation-prompt_prompt_zh.md',
    ],
  },
  {
    id: '05-repair',
    label: '运行时修复提示词',
    files: [
      'core_agent-loop_runtime-context-cleared_prompt_zh.md',
      'core_session_repair_interrupted-tool_prompt_zh.md',
    ],
  },
  {
    id: '06-orchestration',
    label: '编排与多智能体提示词',
    files: [
      'workflow_tool-ralph_tool-ralph-section_prompt_zh.md',
      'goal_tool-goal_tool-goal-section_prompt_zh.md',
      'workflow_tool-workflow_tool-workflow-section_prompt_zh.md',
      'subagent_tool-subagent_tool-subagent-background-section_prompt_zh.md',
      'subagent_tool-subagent-report_tool-report-section_prompt_zh.md',
      'subagent_subagent-in-process-driver_structured-output-instruction_prompt_zh.md',
      'goal_tool-goal_render-wrapup-context_prompt_zh.md',
      'skill_skill_render-skill-content_prompt_zh.md',
      'session-query_tool-session-query_prompt-text_prompt_zh.md',
      'context_session-reference_prompt-prefix_prompt_zh.md',
    ],
  },
  {
    id: '07-descriptions',
    label: '工具描述补遗',
    files: [
      'workflow_tool-workflow_workflow-description_prompt_zh.md',
      'subagent_subagent-in-process-driver_structured-output-description_prompt_zh.md',
      'subagent_tool-subagent-report_report-description_prompt_zh.md',
      'plan_plan-mode_exit-plan-mode-description_prompt_zh.md',
      'todo_tool-todo_todo-write-description_prompt_zh.md',
      'goal_tool-goal_create-goal-description_prompt_zh.md',
      'goal_tool-goal_update-goal-description_prompt_zh.md',
    ],
  },
  {
    id: '08-interaction',
    label: '交互与钩子提示词',
    files: [
      'interaction_user-approval_approval-policy-change_prompt_zh.md',
      'interaction_user-questions_delegated-caller-error_prompt_zh.md',
      'interaction_tool-ask-user_ask-user-description_prompt_zh.md',
      'session_session-checkpoint-policy_aborted-result_prompt_zh.md',
      'hooks_default-deny-block-feedback_prompt_zh.md',
      'context_time-context_browser-timezone-context_prompt_zh.md',
    ],
  },
  {
    id: '09-results',
    label: '工具结果与定时提示',
    files: [
      'shell_tool-bash-persistent_default-description-and-messages_prompt_zh.md',
      'fs_tool-str-replace-editor_default-description_prompt_zh.md',
      'web_tool-web_truncation-footer_prompt_zh.md',
      'schedule_schedule_reminder-framing_prompt_zh.md',
      'context_agent-instructions_change-templates_prompt_zh.md',
    ],
  },
]

const PROMPTS_SRC = join(SRC, 'translated_prompts')

// 从翻译文档提取有辨识度的标题
// 优先级：① section name / 变量名 → ② 首行"提示词翻译文档：xxx" → ③ 文件名"最后一段" → ④ 功能模块
function extractTitle(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const lines = raw.split('\n')
  const fname = filePath.split(/[\\/]/).pop() ?? ''
  // ① 元信息 - 变量名称（优先 section name）
  const varLine = lines.find(l => /^-\s*变量名称/.test(l.trim()))
  if (varLine) {
    const sn = varLine.match(/section\s*(?:name|名)\s*为\s*`?([A-Za-z][A-Za-z0-9_:.-]{0,50})`?/)
    if (sn && !/ctx\.|\{\.\.\.\}/.test(sn[1])) return sn[1].trim()
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
  const base = fname.replace(/_prompt_zh\.md$/, '')
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

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

// 文件名 → 模块 id 的反查表（用于重写分析报告中的相对链接）
const fileToModule = {}
for (const mod of MODULES) {
  for (const fname of mod.files) {
    fileToModule[fname] = mod.id
  }
}

// 把分析报告里指向 translated_prompts/xxx.md 的相对链接重写为站点路径
function rewriteLinks(md) {
  let out = md
  // 指向具体翻译文档的链接 → 站点模块路径
  out = out.replace(
    /\]\(\.\/translated_prompts\/([^)#]+?)_prompt_zh\.md(#[^)]*)?\)/g,
    (m, fname, hash) => {
      const modId = fileToModule[`${fname}_prompt_zh.md`]
      if (modId === undefined) return m
      return `](/prompts/${modId}/${fname}_prompt_zh${hash ?? ''})`
    },
  )
  // 指向 INDEX.md 的链接 → 提示词总览页
  out = out.replace(/\]\(\.\/translated_prompts\/INDEX\.md(#[^)]*)?\)/g, '](/prompts/)')
  out = out.replace(/\]\(\.\/translated_prompts\/index(#[^)]*)?\)/g, '](/prompts/)')
  return out
}

// 去掉提示词文档首行的 "# 提示词翻译文档（：xxx）"，让正文从"元信息"开始
// （侧边栏已展示具体标题，正文无需重复显示该前缀）
function cleanPromptTitle(md) {
  return md.replace(/^#\s*提示词翻译文档[^\n]*\n+/, '')
}

// 1. 复制技术分析报告与产品说明书
ensureDir(join(DOCS, 'guide'))
const analysis = rewriteLinks(readFileSync(join(SRC, 'AI_MODEL_USAGE_ANALYSIS.md'), 'utf8'))
writeFileSync(join(DOCS, 'guide', 'analysis.md'), analysis, 'utf8')
copyFileSync(join(SRC, 'PRODUCT_GUIDE.md'), join(DOCS, 'guide', 'product-guide.md'))
console.log('[ok] 复制 guide/analysis.md（已重写提示词链接）与 guide/product-guide.md')

// 2. 复制提示词翻译文档并按模块分组
const sidebar = []
let totalFiles = 0

for (const mod of MODULES) {
  const modDir = join(DOCS, 'prompts', mod.id)
  ensureDir(modDir)
  const items = []
  for (const fname of mod.files) {
    const src = join(PROMPTS_SRC, fname)
    if (!existsSync(src)) {
      console.error(`[missing] ${fname}`)
      continue
    }
    const title = extractTitle(src)
    const dest = join(modDir, fname)
    const clean = cleanPromptTitle(readFileSync(src, 'utf8'))
    writeFileSync(dest, clean, 'utf8')
    items.push({ text: title, link: `/prompts/${mod.id}/${fname.replace(/\.md$/, '')}` })
    totalFiles++
  }
  sidebar.push({ text: mod.label, collapsed: true, items })
  console.log(`[ok] ${mod.label}: ${items.length} 篇`)
}

// 3. 写 sidebar 配置（供 config 使用）
const sidebarJs = `// 自动生成，勿手改。运行 node scripts/build-content.mjs 重新生成
export default ${JSON.stringify(sidebar, null, 2)}
`
ensureDir(join(DOCS, '.vitepress'))
writeFileSync(join(DOCS, '.vitepress', 'prompts-sidebar.mjs'), sidebarJs, 'utf8')
console.log('[ok] 生成 .vitepress/prompts-sidebar.mjs')

console.log(`\n完成：共复制 ${totalFiles} 篇提示词文档。`)
