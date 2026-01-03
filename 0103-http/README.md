# HTTP 학습용 서버

순수 Node.js `net` 모듈로 구현한 HTTP 서버 (1.0 / 1.1 지원)

## 실행

```bash
npm start
```

## 테스트

### npm run

```bash
npm run curl:home    # GET / - JSON 응답
npm run curl:hello   # GET /hello - 텍스트 응답
npm run curl:echo    # GET /echo - 요청 정보 반환
npm run curl:post    # POST /echo - 바디 포함
npm run curl:404     # 404 에러
npm run curl:http11  # HTTP/1.1 요청
```

### cookie

```bash
npm run curl:cookie:set  # 쿠키 설정 (Set-Cookie 헤더)
npm run curl:cookie:get  # 쿠키 전송 (Cookie 헤더)
```

### keep-alive

```bash
# 단일 요청 + 연결 과정 trace
npm run curl:keepalive
# 두 요청을 같은 연결로 (trace 출력)
npm run test:keepalive
```

Keep-Alive 동작 확인 (--trace-ascii로 클라이언트에서 확인):
```
== Info: Re-using existing connection with host localhost  ← 연결 재사용!
=> Send header, ...
<= Recv header, ...
```

## curl 테스트

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
