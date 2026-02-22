# Project Agent Instructions

## Skills

### Available skills

- `speckit-constitution`: Define or update project governing principles and quality gates.
  Path: `.agents/skills/speckit-constitution/SKILL.md`
- `speckit-specify`: Create feature branch/spec/checklist from feature intent.
  Path: `.agents/skills/speckit-specify/SKILL.md`
- `speckit-clarify`: Resolve spec ambiguity with structured Q&A and direct spec updates.
  Path: `.agents/skills/speckit-clarify/SKILL.md`
- `speckit-plan`: Build implementation design artifacts for the active feature.
  Path: `.agents/skills/speckit-plan/SKILL.md`
- `speckit-tasks`: Generate dependency-ordered tasks by user story.
  Path: `.agents/skills/speckit-tasks/SKILL.md`
- `speckit-analyze`: Run read-only consistency and coverage analysis.
  Path: `.agents/skills/speckit-analyze/SKILL.md`
- `speckit-checklist`: Build requirement-quality checklist artifacts.
  Path: `.agents/skills/speckit-checklist/SKILL.md`
- `speckit-implement`: Execute implementation tasks with checklist gating.
  Path: `.agents/skills/speckit-implement/SKILL.md`
- `speckit-taskstoissues`: Convert tasks into GitHub issues for this repository.
  Path: `.agents/skills/speckit-taskstoissues/SKILL.md`

### Trigger rules

- If the user names a specific phase (constitution/specify/clarify/plan/tasks/analyze/checklist/implement/taskstoissues), use exactly the matching single skill.
- If the user requests multiple phases, run the corresponding skills sequentially in phase order.
- If the user says `speckit` without phase detail, ask which phase to start, then use that phase skill.
