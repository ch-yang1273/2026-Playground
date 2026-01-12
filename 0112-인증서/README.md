# 인증서 파싱 및 검증

X.509 인증서의 구조를 이해하고 검증하는 프로젝트

## 파일 구조

| 파일 | 설명 |
|------|------|
| `CertParser.java` | PEM 파일 파싱, 인증서 정보 출력 |
| `CertVerifier.java` | 체인 서명 검증 + CA 신뢰 검증 |
| `dj.pem` | 샘플 인증서 (daouoffice.com) |

## 실행 방법

```bash
# 인증서 파싱
javac CertParser.java
java CertParser dj.pem      # 전체 출력
java CertParser dj.pem 0    # 첫 번째 인증서만

# 체인 검증
javac CertVerifier.java
java CertVerifier dj.pem
```

## 학습 문서

1. [1.인증서구조.md](1.인증서구조.md) - X.509 인증서의 구조와 인코딩 레이어
2. [2.인증서발급과정.md](2.인증서발급과정.md) - CSR 생성부터 인증서 발급까지
3. [3.인증서검증과정.md](3.인증서검증과정.md) - 체인 서명 검증과 CA 신뢰 확인