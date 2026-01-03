/**
 * 라우터 및 핸들러
 *
 * Express 스타일의 간단한 라우팅 시스템
 */
const { createResponse } = require('./http/response');

// 라우트 저장소
const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {}
};

/**
 * 라우트 등록
 */
function get(path, handler) {
  routes.GET[path] = handler;
}

function post(path, handler) {
  routes.POST[path] = handler;
}

function put(path, handler) {
  routes.PUT[path] = handler;
}

function del(path, handler) {
  routes.DELETE[path] = handler;
}

/**
 * 요청 처리
 * @param {object} request - 파싱된 HTTP 요청
 * @param {net.Socket} socket - 소켓
 */
function handleRequest(request, socket) {
  const { method, path, version, headers } = request;
  const options = { requestHeaders: headers };

  // 해당 메서드의 라우트 찾기
  const methodRoutes = routes[method];
  if (!methodRoutes) {
    return send405(socket, method, version, options);
  }

  // 정확한 경로 매칭
  const handler = methodRoutes[path];
  if (handler) {
    try {
      handler(request, createResponse(200, version, options), socket);
    } catch (err) {
      console.error('핸들러 에러:', err);
      send500(socket, err.message, version, options);
    }
    return;
  }

  // 404 Not Found
  send404(socket, path, version, options);
}

/**
 * 404 응답
 */
function send404(socket, path, version, options) {
  createResponse(404, version, options)
    .json({
      error: 'Not Found',
      message: `경로를 찾을 수 없습니다: ${path}`
    })
    .send(socket);
}

/**
 * 405 응답
 */
function send405(socket, method, version, options) {
  createResponse(405, version, options)
    .json({
      error: 'Method Not Allowed',
      message: `지원하지 않는 메서드입니다: ${method}`
    })
    .send(socket);
}

/**
 * 500 응답
 */
function send500(socket, message, version, options) {
  createResponse(500, version, options)
    .json({
      error: 'Internal Server Error',
      message: message
    })
    .send(socket);
}

module.exports = {
  get,
  post,
  put,
  delete: del,
  handleRequest
};
