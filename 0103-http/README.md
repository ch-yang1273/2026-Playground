# HTTP 학습용 서버

순수 Node.js `net` 모듈로 구현한 HTTP/1.0 서버

## 실행

```bash
npm start
```

## 테스트 (curl)

```bash
# 홈 - JSON 응답
curl -v --http1.0 http://localhost:8080/

# Hello - 텍스트 응답
curl -v --http1.0 http://localhost:8080/hello

# Echo - GET 요청 정보 반환
curl -v --http1.0 http://localhost:8080/echo

# Echo - POST 요청 + 바디
curl -v --http1.0 -X POST -d "name=test" http://localhost:8080/echo

# 404 에러
curl -v --http1.0 http://localhost:8080/notfound
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