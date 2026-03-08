# Functions Prototype

Last updated: 2026-03-08

Purpose:
- Cloud Functions and task workers for the first prototype

Current ownership:
- task queue handlers
- analysis adapter
- trusted write utilities
- cleanup handlers

Current baseline:
- `src/tasks/`
- `src/analysis/`
- `src/http/`

Implemented so far:
- HTTP healthcheck function
- provider-agnostic analysis adapter contract
- stub capture-analysis task entrypoint

Coordination note:
- start with a provider-agnostic analysis adapter and a mock implementation
