# HTTP 학습용 서버

순수 Node.js `net` 모듈로 구현한 HTTP 서버 (1.0 / 1.1 지원)

## 실행

```bash
npm start
```

## 테스트 (npm run)

```bash
npm run curl:home    # GET / - JSON 응답
npm run curl:hello   # GET /hello - 텍스트 응답
npm run curl:echo    # GET /echo - 요청 정보 반환
npm run curl:post    # POST /echo - 바디 포함
npm run curl:404     # 404 에러
npm run curl:http11  # HTTP/1.1 요청
```

## 테스트 (curl 직접)

```bash
# HTTP/1.0
curl -v --http1.0 http://localhost:8080/

# HTTP/1.1
curl -v --http1.1 http://localhost:8080/

# POST 요청
curl -v --http1.0 -X POST -d "name=test" http://localhost:8080/echo
```

## 프로젝트 구조

```
src/
├── server.js           # 서버 진입점 + 라우트 정의
├── handler.js          # 라우터
└── http/
    ├── parser.js       # HTTP 요청 파싱
    └── response.js     # HTTP 응답 빌더
```
