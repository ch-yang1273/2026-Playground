/**
 * HTTP 요청 파서
 *
 * HTTP 요청 형식:
 * REQUEST-LINE\r\n
 * HEADER: VALUE\r\n
 * HEADER: VALUE\r\n
 * \r\n
 * BODY
 */

/**
 * HTTP 요청 문자열을 파싱하여 객체로 반환
 * @param {string} rawRequest - raw HTTP 요청 문자열
 * @returns {object} 파싱된 요청 객체
 */
function parseRequest(rawRequest) {
  const request = {
    method: '',
    path: '',
    version: '',
    headers: {},
    cookies: {},
    body: ''
  };

  // 헤더와 바디 분리 (\r\n\r\n으로 구분)
  const [headerSection, ...bodyParts] = rawRequest.split('\r\n\r\n');
  request.body = bodyParts.join('\r\n\r\n');

  // 헤더 섹션을 줄 단위로 분리
  const lines = headerSection.split('\r\n');

  // 첫 번째 줄: Request Line (예: GET /path HTTP/1.0)
  const requestLine = lines[0];
  const [method, path, version] = requestLine.split(' ');
  request.method = method;
  request.path = path;
  request.version = version;

  // 나머지 줄: 헤더 (예: Host: localhost)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();
    request.headers[key] = value;
  }

  // 쿠키 파싱 (Cookie: name=value; name2=value2)
  if (request.headers['cookie']) {
    const cookiePairs = request.headers['cookie'].split(';');
    for (const pair of cookiePairs) {
      const [name, ...valueParts] = pair.trim().split('=');
      if (name) {
        request.cookies[name.trim()] = valueParts.join('=').trim();
      }
    }
  }

  return request;
}

/**
 * 파싱된 요청 정보를 콘솔에 출력 (디버깅용)
 * @param {object} request - 파싱된 요청 객체
 */
function logRequest(request) {
  console.log('=== 파싱된 HTTP 요청 ===');
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Version: ${request.version}`);
  console.log('Headers:');
  for (const [key, value] of Object.entries(request.headers)) {
    console.log(`  ${key}: ${value}`);
  }
  if (request.body) {
    console.log(`Body: ${request.body}`);
  }
  console.log('========================');
}

module.exports = { parseRequest, logRequest };
