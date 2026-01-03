/**
 * HTTP 응답 빌더
 *
 * HTTP 응답 형식:
 * HTTP/1.0 STATUS MESSAGE\r\n
 * HEADER: VALUE\r\n
 * HEADER: VALUE\r\n
 * \r\n
 * BODY
 */

// HTTP 상태 코드 정의
const STATUS_CODES = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error'
};

/**
 * HTTP 응답 객체 생성
 * @param {number} statusCode - HTTP 상태 코드
 * @returns {object} 응답 빌더 객체
 */
function createResponse(statusCode = 200) {
  const response = {
    version: 'HTTP/1.0',
    statusCode: statusCode,
    statusMessage: STATUS_CODES[statusCode] || 'Unknown',
    headers: {},
    body: ''
  };

  const builder = {
    /**
     * 상태 코드 설정
     */
    status(code) {
      response.statusCode = code;
      response.statusMessage = STATUS_CODES[code] || 'Unknown';
      return builder;
    },

    /**
     * 헤더 추가
     */
    header(key, value) {
      response.headers[key] = value;
      return builder;
    },

    /**
     * Content-Type 설정
     */
    contentType(type) {
      response.headers['Content-Type'] = type;
      return builder;
    },

    /**
     * 텍스트 응답 바디 설정
     */
    text(content) {
      response.body = content;
      response.headers['Content-Type'] = 'text/plain; charset=utf-8';
      return builder;
    },

    /**
     * HTML 응답 바디 설정
     */
    html(content) {
      response.body = content;
      response.headers['Content-Type'] = 'text/html; charset=utf-8';
      return builder;
    },

    /**
     * JSON 응답 바디 설정
     */
    json(data) {
      response.body = JSON.stringify(data);
      response.headers['Content-Type'] = 'application/json; charset=utf-8';
      return builder;
    },

    /**
     * HTTP 응답 문자열로 변환
     */
    build() {
      // Content-Length 자동 계산
      const bodyLength = Buffer.byteLength(response.body);
      response.headers['Content-Length'] = bodyLength;

      // Date 헤더 추가
      response.headers['Date'] = new Date().toUTCString();

      // 상태 라인
      let result = `${response.version} ${response.statusCode} ${response.statusMessage}\r\n`;

      // 헤더들
      for (const [key, value] of Object.entries(response.headers)) {
        result += `${key}: ${value}\r\n`;
      }

      // 빈 줄 + 바디
      result += '\r\n';
      result += response.body;

      return result;
    },

    /**
     * 소켓에 응답 전송
     */
    send(socket) {
      const data = builder.build();
      socket.write(data);
      socket.end();
      return builder;
    }
  };

  return builder;
}

module.exports = { createResponse, STATUS_CODES };
