# workerflow-cli

JSON 기반 작업 시각화 CLI 도구.

## 설치

```bash
npm install -g workerflow-cli
```

또는 소스에서:

```bash
git clone <repo-url>
cd workerflow-cli
npm install
npm run build
```

## 사용법

```bash
# 파일에서 읽기
workerflow-cli view --input <json-file>

# stdin에서 읽기
cat <json-file> | workerflow-cli view --stdin

# 포트 변경
workerflow-cli view --input <json-file> --port 8080
```

## JSON 형식

```json
{
  "title": "프로젝트 이름",
  "tasks": [
    {
      "id": "1",
      "title": "작업 제목",
      "status": "TODO|IN_PROGRESS|REVIEW|BLOCKED|DONE",
      "description": "작업 설명",
      "createdAt": "2026-04-16T10:00:00Z",
      "updatedAt": "2026-04-16T12:00:00Z"
    }
  ]
}
```

## 라이선스

MIT

---

[English](./README.md)