# workerflow-cli

Visualize structured JSON task data as a local Kanban board with watch mode, automatic reload, and change notifications.

`workerflow-cli` is a lightweight local CLI for personal workflows, AI-assisted task tracking, and local orchestration visibility.

[한국어 문서](./README.ko.md)

## Why this tool exists

When working with AI tools, scripts, or local orchestration flows, it is often hard to see what is actually happening at a glance.

Tasks may be running, changing, or moving between states, but that progress is usually buried in logs, scattered across files, or difficult to track visually.

`workerflow-cli` was created to make that process easier to understand by turning structured task data into a simple local Kanban board with automatic reload and clear change feedback.

### Main board

<p align="center">
  <img src="./screenshots/Main board.png" alt="Main board" width="900" />
</p>

## Features

* JSON-based Kanban board
* Local web view
* `--watch` mode for automatic reload on file changes
* Live update feedback

  * toast notifications
  * changed-card highlighting
  * terminal reload logs
* Extended task metadata

  * `agent`
  * `priority`
  * `tags`
* Summary section
* Zod-based input validation with detailed error messages

## Installation

```bash id="e8xhkj"
npm install -g workerflow-cli
```

Or run from source:

```bash id="wlb3ml"
git clone https://github.com/YuYoungKwang/workerflow.git
cd workerflow
npm install
npm run build
```

## Quick Start

### From file

```bash id="mqt65x"
workerflow-cli view --input ./sample.json
```

### Watch mode

```bash id="cevwot"
workerflow-cli view --input ./sample.json --watch
```

### From stdin

```bash id="avw0tp"
cat ./sample.json | workerflow-cli view --stdin
```

### Custom port

```bash id="me2m7o"
workerflow-cli view --input ./sample.json --port 8080
```

## Watch Mode

When the input file changes, `workerflow-cli` automatically reloads the board and shows update feedback.

* browser toast notifications
* changed-card highlighting
* terminal log output

Example terminal log:

```text id="3i6jk7"
[2026-04-22 18:51:23] Watching file: sample.json
[2026-04-22 18:51:25] File reloaded: 2 task(s) changed
```

Example toast messages:

* `+1 added, 2 moved, 1 updated`
* `3 tasks changed`

## JSON Format

### Minimal format

```json id="lhyjfo"
{
  "title": "Project Name",
  "tasks": [
    {
      "id": "1",
      "title": "Task Title",
      "status": "TODO",
      "description": "Task description",
      "createdAt": "2026-04-16T10:00:00Z",
      "updatedAt": "2026-04-16T12:00:00Z"
    }
  ]
}
```

### Extended format

```json id="fu2wwj"
{
  "title": "Project Name",
  "summary": {
    "total": 10,
    "completed": 3,
    "inProgress": 2,
    "blocked": 1
  },
  "tasks": [
    {
      "id": "1",
      "title": "Task Title",
      "status": "TODO",
      "description": "Description",
      "agent": "@frontend-agent",
      "priority": "high",
      "tags": ["frontend", "bug"],
      "createdAt": "2026-04-16T10:00:00Z",
      "updatedAt": "2026-04-16T12:00:00Z"
    }
  ]
}
```

## Status Values

Supported task statuses:

* `TODO`
* `IN_PROGRESS`
* `REVIEW`
* `BLOCKED`
* `DONE`

## Validation

Input data is validated with Zod.

If the input JSON is invalid or required fields are missing, `workerflow-cli` prints detailed field-level validation errors to help you fix the file quickly.

## Use Cases

* personal task visualization
* AI-assisted workflow tracking
* local agent/orchestrator status board
* JSON-to-board debugging during development

## Roadmap

* adapter layer for external agents and orchestrators
* import/export improvements
* richer filtering and search
* optional sound notifications

## License

MIT
