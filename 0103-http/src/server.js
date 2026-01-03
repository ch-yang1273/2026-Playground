const net = require('net');
const { parseRequest, logRequest } = require('./http/parser');
const router = require('./handler');

const PORT = 8080;

// ===== 라우트 정의 =====

// 홈
router.get('/', (req, res, socket) => {
  res.json({
    message: 'HTTP/1.0 서버에 오신 것을 환영합니다!',
    endpoints: [
      'GET /',
      'GET /hello',
      'GET /echo',
      'POST /echo'
    ]
  }).send(socket);
});

// Hello
router.get('/hello', (req, res, socket) => {
  res.text('Hello, World!').send(socket);
});

// Echo (GET)
router.get('/echo', (req, res, socket) => {
  res.json({
    method: req.method,
    path: req.path,
    version: req.version,
    headers: req.headers
  }).send(socket);
});

// Echo (POST)
router.post('/echo', (req, res, socket) => {
  res.json({
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  }).send(socket);
});

// 쿠키 설정
router.get('/cookie/set', (req, res, socket) => {
  res
    .header('Set-Cookie', 'session=abc123; Path=/')
    .json({ message: '쿠키가 설정되었습니다', cookie: 'session=abc123' })
    .send(socket);
});

// 쿠키 읽기
router.get('/cookie/get', (req, res, socket) => {
  res.json({
    message: '수신된 쿠키',
    cookies: req.cookies
  }).send(socket);
});

// ===== 서버 시작 =====

const server = net.createServer((socket) => {
  console.log('클라이언트 연결됨:', socket.remoteAddress);

  socket.on('data', (data) => {
    const rawRequest = data.toString();

    // HTTP 요청 원문 출력 (학습용)
    console.log('--- 수신된 HTTP 요청 ---');
    console.log(rawRequest);
    console.log('------------------------');

    // 요청 파싱
    const request = parseRequest(rawRequest);
    logRequest(request);

    // 라우터로 요청 처리
    router.handleRequest(request, socket);
  });

  socket.on('error', (err) => {
    console.error('소켓 에러:', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`HTTP 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
