# workerflow-cli

JSON-based task visualization CLI tool with local web view.

[한국어](./README.ko.md)

## Installation

```bash
npm install -g workerflow-cli
```

Or from source:

```bash
git clone <repo-url>
cd workerflow-cli
npm install
npm run build
```

## Usage

```bash
# Read from file
workerflow-cli view --input <json-file>

# Read from stdin
cat <json-file> | workerflow-cli view --stdin

# Custom port
workerflow-cli view --input <json-file> --port 8080
```

## JSON Format

```json
{
  "title": "Project Name",
  "tasks": [
    {
      "id": "1",
      "title": "Task Title",
      "status": "TODO|IN_PROGRESS|REVIEW|BLOCKED|DONE",
      "description": "Task description",
      "createdAt": "2026-04-16T10:00:00Z",
      "updatedAt": "2026-04-16T12:00:00Z"
    }
  ]
}
```

## License

MIT

---

