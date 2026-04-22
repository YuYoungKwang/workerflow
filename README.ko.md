# workerflow-cli

구조화된 JSON 작업 데이터를 로컬 칸반 보드로 시각화하는 CLI 도구입니다.
`--watch` 모드, 자동 리로드, 변경 알림 기능을 지원합니다.

`workerflow-cli`는 개인 워크플로 관리, AI 지원 작업 추적, 로컬 오케스트레이션 가시성 확보를 위해 설계된 경량 로컬 CLI 도구입니다.

[English](./README.md)

## 왜 이 도구를 만들었나요?

AI 도구, 스크립트, 로컬 오케스트레이션 흐름으로 작업할 때는 지금 무엇이 실제로 진행 중인지 한눈에 파악하기 어려운 경우가 많습니다.

작업은 계속 실행되고 상태도 바뀌지만, 그 흐름이 로그에 묻히거나 파일 여러 곳에 흩어져 있어서 시각적으로 추적하기가 불편했습니다.

`workerflow-cli`는 이런 불편함을 줄이기 위해 만들었습니다.
구조화된 작업 데이터를 로컬 칸반 보드로 시각화하고, 자동 리로드와 변경 알림을 통해 작업 흐름을 더 쉽게 이해할 수 있도록 돕습니다.

### 기본 보드 화면

<p align="center">
  <img src="./screenshots/Main board.png" alt="Main board" width="900" />
</p>

## 주요 기능

* JSON 기반 칸반 보드
* 로컬 웹 뷰
* 파일 변경 시 자동으로 다시 반영되는 `--watch` 모드
* 실시간 업데이트 피드백

  * 토스트 알림
  * 변경된 카드 하이라이트
  * 터미널 리로드 로그
* 확장 태스크 메타데이터

  * `agent`
  * `priority`
  * `tags`
* 상단 요약 섹션
* Zod 기반 입력 검증 및 상세 오류 메시지

## 설치

```bash id="pwma94"
npm install -g workerflow-cli
```

또는 소스에서 실행:

```bash id="4m7iz7"
git clone https://github.com/YuYoungKwang/workerflow.git
cd workerflow
npm install
npm run build
```

## 빠른 시작

### 파일 입력

```bash id="it0lbq"
workerflow-cli view --input ./sample.json
```

### watch 모드

```bash id="x321ku"
workerflow-cli view --input ./sample.json --watch
```

### stdin 입력

```bash id="wio1e2"
cat ./sample.json | workerflow-cli view --stdin
```

### 포트 지정

```bash id="h764hc"
workerflow-cli view --input ./sample.json --port 8080
```

## watch 모드

입력 파일이 변경되면 `workerflow-cli`가 자동으로 보드를 다시 불러오고, 변경 사항을 알림으로 표시합니다.

* 브라우저 토스트 알림
* 변경된 카드 하이라이트
* 터미널 로그 출력

터미널 로그 예시:

```text id="4p1i3f"
[2026-04-22 18:51:23] Watching file: sample.json
[2026-04-22 18:51:25] File reloaded: 2 task(s) changed
```

토스트 메시지 예시:

* `+1 added, 2 moved, 1 updated`
* `3 tasks changed`

## JSON 형식

### 최소 형식

```json id="o5qqn7"
{
  "title": "프로젝트 이름",
  "tasks": [
    {
      "id": "1",
      "title": "작업 제목",
      "status": "TODO",
      "description": "작업 설명",
      "createdAt": "2026-04-16T10:00:00Z",
      "updatedAt": "2026-04-16T12:00:00Z"
    }
  ]
}
```

### 확장 형식

```json id="w7glrn"
{
  "title": "프로젝트 이름",
  "summary": {
    "total": 10,
    "completed": 3,
    "inProgress": 2,
    "blocked": 1
  },
  "tasks": [
    {
      "id": "1",
      "title": "작업 제목",
      "status": "TODO",
      "description": "설명",
      "agent": "@frontend-agent",
      "priority": "high",
      "tags": ["frontend", "bug"],
      "createdAt": "2026-04-16T10:00:00Z",
      "updatedAt": "2026-04-16T12:00:00Z"
    }
  ]
}
```

## 상태 값

지원되는 작업 상태는 다음과 같습니다.

* `TODO`
* `IN_PROGRESS`
* `REVIEW`
* `BLOCKED`
* `DONE`

## 검증

입력 데이터는 Zod로 검증됩니다.

입력 JSON 형식이 올바르지 않거나 필수 필드가 누락된 경우, `workerflow-cli`는 어떤 필드에 문제가 있는지 상세한 오류 메시지를 출력합니다.

## 사용 사례

* 개인 작업 시각화
* AI 지원 워크플로 추적
* 로컬 에이전트/오케스트레이터 상태 보드
* 개발 중 JSON-to-board 디버깅

## 로드맵

* 외부 에이전트 및 오케스트레이터용 어댑터 레이어
* 가져오기/내보내기 기능 개선
* 필터링 및 검색 기능 강화
* 선택형 사운드 알림

## 라이선스

MIT
