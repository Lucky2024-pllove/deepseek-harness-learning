## 元信息
- 原文件位置: `packages/context/tmux-context/src/index.ts:162-173`（`renderState` 第 162-168 行，`renderReading` 第 171-173 行，`READING_PREFIX` 第 73 行）
- 变量名称: `renderReading(location, turn)` / `renderState(location)`（模板函数）+ 常量 `READING_PREFIX`
- 功能模块: tmux 位置上下文插件（tmux-context，opt-in 请求准备期 tmux 位置上下文）
- 调用场景: 每回合首个请求（`step === 1`）时，若进程确实运行于某个 tmux 窗格内，注入一条持久化、带来源归属的 tmux 会话/窗口/窗格位置消息
- 来源分类: 生产代码

## 英文原文

### 模板源码
```
READING_PREFIX = 'tmux location (turn '
renderState: `session ${location.sessionName}, `
  + `window ${location.windowIndex} ${JSON.stringify(location.windowName)}, `
  + `pane ${location.paneIndex} ${location.paneId}\n`
  + `window active=${location.windowActive}, pane active=${location.paneActive}, `
  + `layout ${location.windowLayout}`
renderReading: `${READING_PREFIX}${turn}):\n${renderState(location)}`
```

### 完整组装形态（示例）
```
tmux location (turn 4):
session my-session, window 0 "main", pane 1 %12
window active=1, pane active=1, layout 225f,212x50,0,0{169x50,0,0,0,55x50,170,0,1}
```

## 中文翻译
```
tmux 位置（第 ${turn} 轮）：
会话 ${sessionName}，窗口 ${windowIndex} ${windowName}，窗格 ${paneIndex} ${paneId}
窗口 active=${windowActive}，窗格 active=${paneActive}，布局 ${windowLayout}
```
（`JSON.stringify(location.windowName)` 使窗口名以带引号的 JSON 字符串形式呈现，如 `"main"`）

## 关键参数
- `${turn}` — 当前回合号（`READING_PREFIX` + `${turn}` + `):` 构成易变的前言行；稳定状态块用于变化抑制）
- `${location.sessionName}` — tmux 会话名（`#{session_name}`）
- `${location.windowIndex}` / `${location.windowName}` — 窗口索引（`#{window_index}`）与窗口名（`#{window_name}`，经 `JSON.stringify`）
- `${location.paneIndex}` / `${location.paneId}` — 窗格索引（`#{pane_index}`）与窗格 id（`#{pane_id}`，如 `%12`）
- `${location.windowActive}` / `${location.paneActive}` — 窗口/窗格激活标志（`#{window_active}`/`#{pane_active}`）
- `${location.windowLayout}` — 窗格树布局描述（`#{window_layout}`）

## Few-shot 示例
无

## 提示词链路
- 上游: `agent/pre-step`（`{ prepend: true }`）监听器（第 218-246 行）在 `next()` 放行且 `step === 1` 时，经 `queryTmuxLocation`（第 107-155 行）通过 `ctx.shell` 执行 `tmux display-message` 读取字段，并以 `#{pane_tty}` 与进程控制终端匹配确认真实位于窗格内；`latestInjectedState` + `refreshIntervalMs` 做注入抑制，状态未变化则不重复注入
- 下游: `renderReading` 文本经 `createUserMessage` 打包（source `{kind:'plugin', plugin:'tmux-context', form:'snapshot', sections:[{name, text}]}`），前置到 `decision.messages` 开头（`kind:'enter'`），进入模型请求并持久化
- 注入时机与 order: 每回合首个请求（`step === 1`）注入；`prepend: true` 先于其他 pre-step 监听器；非 `systemPrompt.section` 注入，无 order。tmux 环境缺失、仅继承环境、无 `ctx.shell` 或查询失败均为 no-op（警告日志，不中断回合）

## 相关代码上下文
`tmux-context/src/index.ts`：`TMUX_FIELDS`（第 49-58 行）定义查询字段；`queryTmuxLocation`（第 107-155 行）构造 `[ -n "$TMUX_PANE" ] || exit 1` 等 shell 命令；`latestInjectedState`（第 181-194 行）从持久化事件取最后状态块做变化抑制；`apply()` 的 pre-step 监听器（第 218-246 行）。
