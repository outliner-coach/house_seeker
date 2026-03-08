# Skills

Last updated: 2026-03-08

This file tracks which Codex skills are most relevant to this repository and why.

## Newly installed for this project

### security-threat-model

Why it matters:
- the product will store household photos, item locations, and shared family activity
- this skill will help define trust boundaries, abuse paths, and privacy-sensitive flows once the system design exists

When to use:
- after `architecture/system-design.md` exists
- when explicitly modeling threats, abuse cases, or privacy/security boundaries

Installation source:
- `openai/skills`
- `skills/.curated/security-threat-model`

### security-best-practices

Why it matters:
- this project will likely become a web or mobile app with a backend and image-analysis pipeline
- this skill will help keep future implementation secure by default once code work begins

When to use:
- when starting prototype code
- when reviewing backend, frontend, or API security choices

Installation source:
- `openai/skills`
- `skills/.curated/security-best-practices`

## Already installed and relevant

### playwright

Use for:
- browser-based product research
- snapshots, screenshots, and UI-flow verification

### screenshot

Use for:
- desktop capture when browser-only screenshots are not enough

### openai-docs

Use for:
- official OpenAI documentation when selecting image-analysis or multimodal API patterns

### notion-research-documentation

Use for:
- future synthesis if research or specifications move into Notion

### spreadsheet

Use for:
- comparison matrices, scoring sheets, or evaluation workbooks

## Not installing now

### doc

Reason:
- this repository is Markdown-first, not DOCX-first

### figma

Reason:
- no Figma file or node-based implementation work exists yet

## Selection rule

Install new skills only when one of these is true:
- a recurring task cannot be handled well with the current set
- the project enters a new phase such as design handoff or implementation
- the user explicitly asks for a new capability
