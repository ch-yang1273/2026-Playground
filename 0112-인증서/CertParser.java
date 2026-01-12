import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class CertParser {

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.out.println("Usage: java CertParser <pem파일> [인덱스]");
            System.out.println("  인덱스 생략시 모든 인증서 출력");
            System.out.println("  예: java CertParser cert.pem 0");
            return;
        }

        String pemFile = args[0];
        Integer selectedIndex = (args.length >= 2) ? Integer.parseInt(args[1]) : null;

        String content = Files.readString(Path.of(pemFile));

        // === 1단계: PEM 파일 읽기 ===
        System.out.println("=== 1단계: PEM 파일 읽기 ===");
        List<String> base64Certs = extractBase64Certificates(content);
        System.out.println("인증서 " + base64Certs.size() + "개 발견\n");

        if (selectedIndex != null && (selectedIndex < 0 || selectedIndex >= base64Certs.size())) {
            System.out.println("에러: 인덱스는 0~" + (base64Certs.size() - 1) + " 사이여야 합니다.");
            return;
        }

        CertificateFactory factory = CertificateFactory.getInstance("X.509");

        for (int i = 0; i < base64Certs.size(); i++) {
            if (selectedIndex != null && i != selectedIndex) {
                continue;
            }
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("[인증서 " + (i + 1) + "]");
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

            String base64 = base64Certs.get(i);

            // Base64 내용 미리보기
            System.out.println(">> PEM Base64 (처음 60자):");
            System.out.println("   " + base64.substring(0, Math.min(60, base64.length())) + "...\n");

            // === 2단계: Base64 디코딩 ===
            System.out.println(">> Base64 디코딩:");
            byte[] derBytes = Base64.getDecoder().decode(base64);
            System.out.println("   DER 바이트 길이: " + derBytes.length + " bytes");
            System.out.println("   DER 앞부분 (hex): " + bytesToHex(derBytes, 16) + "...\n");

            // === 3단계: ASN.1 DER 파싱 ===
            System.out.println(">> ASN.1 DER 파싱 (CertificateFactory 사용):");
            ByteArrayInputStream bis = new ByteArrayInputStream(derBytes);
            X509Certificate cert = (X509Certificate) factory.generateCertificate(bis);
            System.out.println("   X509Certificate 객체 생성 완료\n");

            // === 4단계: 인증서 정보 출력 ===
            System.out.println(">> 인증서 정보:");
            System.out.println("   Subject (소유자)    : " + cert.getSubjectX500Principal().getName());
            System.out.println("   Issuer (발급자)     : " + cert.getIssuerX500Principal().getName());
            System.out.println("   Serial Number      : " + cert.getSerialNumber().toString(16).toUpperCase());
            System.out.println("   유효기간 시작       : " + cert.getNotBefore());
            System.out.println("   유효기간 만료       : " + cert.getNotAfter());
            System.out.println("   공개키 알고리즘     : " + cert.getPublicKey().getAlgorithm());
            System.out.println("   서명 알고리즘       : " + cert.getSigAlgName());
            System.out.println("   버전               : V" + cert.getVersion());
            System.out.println();
        }
    }

    // PEM 파일에서 Base64 인증서들 추출
    private static List<String> extractBase64Certificates(String pemContent) {
        List<String> certs = new ArrayList<>();
        String BEGIN = "-----BEGIN CERTIFICATE-----";
        String END = "-----END CERTIFICATE-----";

        int start = 0;
        while ((start = pemContent.indexOf(BEGIN, start)) != -1) {
            int end = pemContent.indexOf(END, start);
            if (end == -1) break;

            String base64 = pemContent.substring(start + BEGIN.length(), end)
                    .replaceAll("\\s", ""); // 줄바꿈 제거
            certs.add(base64);
            start = end + END.length();
        }
        return certs;
    }

    // 바이트 배열을 hex 문자열로 변환
    private static String bytesToHex(byte[] bytes, int limit) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(bytes.length, limit); i++) {
            sb.append(String.format("%02X ", bytes[i]));
        }
        return sb.toString().trim();
    }
}