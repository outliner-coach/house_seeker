# Commands

Last updated: 2026-03-08

Run commands from the repository root unless noted otherwise:
- `/Users/friends/ai/homeauto`

Current workspace note:
- this folder is initialized as a Git repository
- origin remote should point to `https://github.com/outliner-coach/house_seeker.git`

## Repository inspection

List the current structure:
```bash
find . -maxdepth 2 \( -type d -o -type f \) | sort
```

List tracked files quickly:
```bash
rg --files
```

Search text across the workspace:
```bash
rg -n "pattern" .
```

Check a specific document section:
```bash
sed -n '1,220p' AGENTS.md
sed -n '1,220p' PLAN.md
sed -n '1,260p' PROGRESS.md
```

## Coordination and git hygiene

Check current changes:
```bash
git status --short
```

Summarize changed files:
```bash
git diff --stat
```

Inspect a specific diff:
```bash
git diff -- AGENTS.md
```

Show configured remotes:
```bash
git remote -v
```

Push the current branch:
```bash
git push -u origin main
```

## Research and reference gathering

Open a remote Markdown file or skill file:
```bash
curl -L https://raw.githubusercontent.com/openai/skills/main/skills/.curated/security-threat-model/SKILL.md | sed -n '1,220p'
```

Fetch a page header to verify a live reference:
```bash
curl -IL https://itemmap.app/ | sed -n '1,12p'
```

## Skill management

List curated installable skills:
```bash
python3 /Users/friends/.codex/skills/.system/skill-installer/scripts/list-skills.py
```

List skills as JSON:
```bash
python3 /Users/friends/.codex/skills/.system/skill-installer/scripts/list-skills.py --format json
```

Install curated skills from `openai/skills`:
```bash
python3 /Users/friends/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo openai/skills \
  --path skills/.curated/security-threat-model skills/.curated/security-best-practices
```

Verify installed local skills:
```bash
ls -la /Users/friends/.codex/skills
```

## Current project routine

Start of task:
```bash
sed -n '1,260p' AGENTS.md
sed -n '1,220p' PLAN.md
sed -n '1,260p' PROGRESS.md
find . -maxdepth 2 \( -type d -o -type f \) | sort
```

Before closing a task:
```bash
git status --short
git diff --stat
sed -n '1,260p' PLAN.md
sed -n '1,260p' PROGRESS.md
```

## Notes

- Use `rg` for search whenever possible.
- Use `apply_patch` for manual file edits.
- Add stack-specific commands only after the prototype target is decided.
