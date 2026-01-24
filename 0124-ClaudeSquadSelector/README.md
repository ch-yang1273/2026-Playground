# Claude Squad Backend Selector

Claude Squad에서 새 세션 생성 시 백엔드를 선택할 수 있는 설정입니다.

## 지원 백엔드

| 옵션 | 백엔드 | 설명 |
|------|--------|------|
| 1 | Claude (Anthropic) | 기본 Anthropic Claude API |
| 2 | Claude (GLM-4.7) | Z.AI API를 통한 GLM-4.7 모델 |

## 설치 방법

### 1. 스크립트 복사 및 실행 권한 부여

```bash
cp claude-selector ~/.local/bin/claude-selector
chmod +x ~/.local/bin/claude-selector
```

### 2. API 키 설정

`~/.local/bin/claude-selector` 파일을 편집하여 `<Z.AI_API_KEY>`를 실제 API 키로 교체:

```bash
export ANTHROPIC_AUTH_TOKEN="your-actual-api-key-here"
```

### 3. Claude Squad 설정 수정

`~/.claude-squad/config.json` 파일 수정:

```json
{
  "default_program": "/Users/ych/.local/bin/claude-selector",
  "auto_yes": false,
  "daemon_poll_interval": 1000,
  "branch_prefix": "ych/"
}
```

## 사용법

1. `cs` 명령어로 Claude Squad 실행
2. `n` 키로 새 세션 생성
3. 백엔드 선택 메뉴에서 원하는 옵션 선택
4. Claude 세션 시작

## 동작 방식

- **옵션 1 선택**: 환경변수 변경 없이 기본 Claude 실행
- **옵션 2 선택**: Z.AI API 환경변수 설정 후 Claude 실행
  - `ANTHROPIC_AUTH_TOKEN`: Z.AI API 키
  - `ANTHROPIC_BASE_URL`: Z.AI API 엔드포인트
  - `API_TIMEOUT_MS`: 타임아웃 설정 (50분)
  - `ANTHROPIC_DEFAULT_HAIKU_MODEL`: glm-4.5-air
  - `ANTHROPIC_DEFAULT_SONNET_MODEL`: glm-4.7
  - `ANTHROPIC_DEFAULT_OPUS_MODEL`: glm-4.7

## 모델 매핑

Z.AI API를 사용할 때 Claude 모델은 다음 GLM 모델로 매핑됩니다:

| Claude 요청 | 실제 사용 모델 |
|-------------|---------------|
| Haiku | glm-4.5-air |
| Sonnet | glm-4.7 |
| Opus | glm-4.7 |

## 트러블슈팅

### 선택 메뉴가 표시되지 않음

tmux 세션 내에서 read 명령이 제대로 동작하는지 확인:
```bash
~/.local/bin/claude-selector
```

### API 키 오류

Z.AI API 키가 올바르게 설정되었는지 확인:
```bash
grep ANTHROPIC_AUTH_TOKEN ~/.local/bin/claude-selector
```

### Claude 실행 실패

Claude 바이너리 경로 확인:
```bash
ls -la ~/.local/bin/claude
```

## 원복 방법

원래 설정으로 되돌리려면 `~/.claude-squad/config.json`의 `default_program`을 수정:

```json
{
  "default_program": "/Users/ych/.local/bin/claude"
}
```
