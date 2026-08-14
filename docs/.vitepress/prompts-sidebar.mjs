// 自动生成，勿手改。运行 node scripts/build-content.mjs 重新生成
export default [
  {
    "text": "系统提示词核心层",
    "collapsed": true,
    "items": [
      {
        "text": "SystemPrompt",
        "link": "/prompts/01-core/core_system-prompt_harness-identity_prompt_zh"
      },
      {
        "text": "PERSONA_SECTION",
        "link": "/prompts/01-core/core_system-prompt_deployment-persona_prompt_zh"
      },
      {
        "text": "joinContextSections",
        "link": "/prompts/01-core/core_system-prompt_runtime-context-envelope_prompt_zh"
      },
      {
        "text": "HARNESS_SOURCE_SECTION",
        "link": "/prompts/01-core/boot_app-boot_harness-source_prompt_zh"
      },
      {
        "text": "app:web-surface",
        "link": "/prompts/01-core/bundle_web-app_web-surface_prompt_zh"
      }
    ]
  },
  {
    "text": "工具使用指导层",
    "collapsed": true,
    "items": [
      {
        "text": "tool:bash",
        "link": "/prompts/02-tools/shell_tool-bash_tool-bash_prompt_zh"
      },
      {
        "text": "tool:pwsh",
        "link": "/prompts/02-tools/shell_tool-pwsh_tool-pwsh_prompt_zh"
      },
      {
        "text": "tool:jobs",
        "link": "/prompts/02-tools/jobs_tool-jobs_tool-jobs_prompt_zh"
      },
      {
        "text": "LSP_PROMPT_TEXT",
        "link": "/prompts/02-tools/lsp_tool-lsp_lsp-prompt_prompt_zh"
      },
      {
        "text": "tool:read",
        "link": "/prompts/02-tools/fs_tool-fs_tool-read_prompt_zh"
      },
      {
        "text": "tool:write",
        "link": "/prompts/02-tools/fs_tool-fs_tool-write_prompt_zh"
      },
      {
        "text": "tool:edit",
        "link": "/prompts/02-tools/fs_tool-fs_tool-edit_prompt_zh"
      },
      {
        "text": "tool:grep",
        "link": "/prompts/02-tools/fs_tool-fs-search_tool-grep_prompt_zh"
      },
      {
        "text": "tool:glob",
        "link": "/prompts/02-tools/fs_tool-fs-search_tool-glob_prompt_zh"
      },
      {
        "text": "tool:web_search",
        "link": "/prompts/02-tools/web_tool-web_tool-web-search_prompt_zh"
      },
      {
        "text": "tool:web_fetch",
        "link": "/prompts/02-tools/web_tool-web_tool-web-fetch_prompt_zh"
      },
      {
        "text": "FILE_REFERENCE_PROMPT",
        "link": "/prompts/02-tools/client_ui-deliverables_file-reference_prompt_zh"
      },
      {
        "text": "CODE_ONLY_INSTRUCTION",
        "link": "/prompts/02-tools/core_tools_code-only-instruction_prompt_zh"
      },
      {
        "text": "SDK_INSTRUCTIONS (TypeScript)",
        "link": "/prompts/02-tools/core_tools_sdk-instructions-ts_prompt_zh"
      },
      {
        "text": "SDK_INSTRUCTIONS (Python)",
        "link": "/prompts/02-tools/core_tools_sdk-instructions-py_prompt_zh"
      },
      {
        "text": "bashDescription",
        "link": "/prompts/02-tools/shell_tool-bash_bash-description_prompt_zh"
      },
      {
        "text": "pwshDescription",
        "link": "/prompts/02-tools/shell_tool-pwsh_pwsh-description_prompt_zh"
      },
      {
        "text": "text",
        "link": "/prompts/02-tools/terminal_tool-terminal_tool-pty_prompt_zh"
      },
      {
        "text": "formatFileView",
        "link": "/prompts/02-tools/fs_tool-str-replace-editor_file-view-prompt_prompt_zh"
      }
    ]
  },
  {
    "text": "动态上下文注入",
    "collapsed": true,
    "items": [
      {
        "text": "renderPolicyContext",
        "link": "/prompts/03-context/sandbox_sandbox-policy_render-policy-context_prompt_zh"
      },
      {
        "text": "NEVER_SENTENCE",
        "link": "/prompts/03-context/interaction_user-approval_approval-policy_prompt_zh"
      },
      {
        "text": "SUBAGENT_DELEGATION_CONTEXT",
        "link": "/prompts/03-context/subagent_subagent_delegation-context_prompt_zh"
      },
      {
        "text": "WORKSPACE_CONTEXT_INTRO",
        "link": "/prompts/03-context/context_agent-instructions_workspace-context_prompt_zh"
      },
      {
        "text": "renderCatalogMessage",
        "link": "/prompts/03-context/skill_tool-skill_skill-catalog_prompt_zh"
      },
      {
        "text": "renderText",
        "link": "/prompts/03-context/context_time-context_time-context_prompt_zh"
      },
      {
        "text": "renderReading",
        "link": "/prompts/03-context/context_tmux-context_tmux-context_prompt_zh"
      }
    ]
  },
  {
    "text": "长指令提示词",
    "collapsed": true,
    "items": [
      {
        "text": "CORDIS_SYSTEM_PROMPT",
        "link": "/prompts/04-long/extensions_tool-cordis_cordis-system-prompt_prompt_zh"
      },
      {
        "text": "COMPACTION_INSTRUCTION",
        "link": "/prompts/04-long/compaction_compaction-basic_compaction-instruction_prompt_zh"
      },
      {
        "text": "CHECKPOINT_PREAMBLE",
        "link": "/prompts/04-long/compaction_compaction-basic_checkpoint-preamble_prompt_zh"
      },
      {
        "text": "systemPrompt",
        "link": "/prompts/04-long/session_session-title-llm_session-title-prompt_prompt_zh"
      },
      {
        "text": "renderGoalRoundPrompt",
        "link": "/prompts/04-long/goal_goal-round-driver_goal-round-prompt_prompt_zh"
      },
      {
        "text": "join",
        "link": "/prompts/04-long/workflow_tool-ralph_ralph-round-prompt_prompt_zh"
      },
      {
        "text": "GENTLE_REMINDER",
        "link": "/prompts/04-long/guard_repeat-tool-reminder_gentle-reminder_prompt_zh"
      },
      {
        "text": "detailedReminder",
        "link": "/prompts/04-long/guard_repeat-tool-reminder_detailed-reminder_prompt_zh"
      },
      {
        "text": "翻译流水线 Prompt 模板（translation-prompt.md）",
        "link": "/prompts/04-long/docs_i18n_translation-prompt_prompt_zh"
      }
    ]
  },
  {
    "text": "运行时修复提示词",
    "collapsed": true,
    "items": [
      {
        "text": "CLEARED",
        "link": "/prompts/05-repair/core_agent-loop_runtime-context-cleared_prompt_zh"
      },
      {
        "text": "interruptedTurnClosers",
        "link": "/prompts/05-repair/core_session_repair_interrupted-tool_prompt_zh"
      }
    ]
  },
  {
    "text": "编排与多智能体提示词",
    "collapsed": true,
    "items": [
      {
        "text": "tool:ralph section（Ralph 工具使用政策）",
        "link": "/prompts/06-orchestration/workflow_tool-ralph_tool-ralph-section_prompt_zh"
      },
      {
        "text": "tool:goal section（Goal 工具使用政策）",
        "link": "/prompts/06-orchestration/goal_tool-goal_tool-goal-section_prompt_zh"
      },
      {
        "text": "workflow",
        "link": "/prompts/06-orchestration/workflow_tool-workflow_tool-workflow-section_prompt_zh"
      },
      {
        "text": "tool:subagent background section（子代理后台运行指导）",
        "link": "/prompts/06-orchestration/subagent_tool-subagent_tool-subagent-background-section_prompt_zh"
      },
      {
        "text": "tool:report section（子代理报告指导）",
        "link": "/prompts/06-orchestration/subagent_tool-subagent-report_tool-report-section_prompt_zh"
      },
      {
        "text": "STRUCTURED_OUTPUT_INSTRUCTION",
        "link": "/prompts/06-orchestration/subagent_subagent-in-process-driver_structured-output-instruction_prompt_zh"
      },
      {
        "text": "renderWrapupContext",
        "link": "/prompts/06-orchestration/goal_tool-goal_render-wrapup-context_prompt_zh"
      },
      {
        "text": "renderSkillContent",
        "link": "/prompts/06-orchestration/skill_skill_render-skill-content_prompt_zh"
      },
      {
        "text": "PROMPT_TEXT",
        "link": "/prompts/06-orchestration/session-query_tool-session-query_prompt-text_prompt_zh"
      },
      {
        "text": "PROMPT_PREFIX",
        "link": "/prompts/06-orchestration/context_session-reference_prompt-prefix_prompt_zh"
      }
    ]
  },
  {
    "text": "工具描述补遗",
    "collapsed": true,
    "items": [
      {
        "text": "DESCRIPTION",
        "link": "/prompts/07-descriptions/workflow_tool-workflow_workflow-description_prompt_zh"
      },
      {
        "text": "structured_output 工具描述",
        "link": "/prompts/07-descriptions/subagent_subagent-in-process-driver_structured-output-description_prompt_zh"
      },
      {
        "text": "report",
        "link": "/prompts/07-descriptions/subagent_tool-subagent-report_report-description_prompt_zh"
      },
      {
        "text": "EXIT_DESCRIPTION",
        "link": "/prompts/07-descriptions/plan_plan-mode_exit-plan-mode-description_prompt_zh"
      },
      {
        "text": "describe",
        "link": "/prompts/07-descriptions/todo_tool-todo_todo-write-description_prompt_zh"
      },
      {
        "text": "CREATE_DESCRIPTION",
        "link": "/prompts/07-descriptions/goal_tool-goal_create-goal-description_prompt_zh"
      },
      {
        "text": "update_goal",
        "link": "/prompts/07-descriptions/goal_tool-goal_update-goal-description_prompt_zh"
      }
    ]
  },
  {
    "text": "交互与钩子提示词",
    "collapsed": true,
    "items": [
      {
        "text": "setPolicy",
        "link": "/prompts/08-interaction/interaction_user-approval_approval-policy-change_prompt_zh"
      },
      {
        "text": "UserQuestionError",
        "link": "/prompts/08-interaction/interaction_user-questions_delegated-caller-error_prompt_zh"
      },
      {
        "text": "description",
        "link": "/prompts/08-interaction/interaction_tool-ask-user_ask-user-description_prompt_zh"
      },
      {
        "text": "abortedBeforeDispatchResult",
        "link": "/prompts/08-interaction/session_session-checkpoint-policy_aborted-result_prompt_zh"
      },
      {
        "text": "hooks 默认 deny/block 反馈（Claude Code + Codex）",
        "link": "/prompts/08-interaction/hooks_default-deny-block-feedback_prompt_zh"
      },
      {
        "text": "renderBrowserTimeZoneContext",
        "link": "/prompts/08-interaction/context_time-context_browser-timezone-context_prompt_zh"
      }
    ]
  },
  {
    "text": "工具结果与定时提示",
    "collapsed": true,
    "items": [
      {
        "text": "TRUNCATED_MESSAGE",
        "link": "/prompts/09-results/shell_tool-bash-persistent_default-description-and-messages_prompt_zh"
      },
      {
        "text": "DEFAULT_DESCRIPTION",
        "link": "/prompts/09-results/fs_tool-str-replace-editor_default-description_prompt_zh"
      },
      {
        "text": "TRUNCATION_FOOTER",
        "link": "/prompts/09-results/web_tool-web_truncation-footer_prompt_zh"
      },
      {
        "text": "renderReminderFraming",
        "link": "/prompts/09-results/schedule_schedule_reminder-framing_prompt_zh"
      },
      {
        "text": "additionalSectionText",
        "link": "/prompts/09-results/context_agent-instructions_change-templates_prompt_zh"
      }
    ]
  }
]
