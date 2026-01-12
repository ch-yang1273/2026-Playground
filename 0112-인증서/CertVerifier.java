import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;

import java.security.KeyStore;
import java.security.MessageDigest;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPublicKey;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Enumeration;
import java.util.List;

public class CertVerifier {

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.out.println("Usage: java CertVerifier <pem파일>");
            return;
        }

        String pemFile = args[0];
        String content = Files.readString(Path.of(pemFile));

        // 인증서 파싱
        List<X509Certificate> certs = parseCertificates(content);
        System.out.println("=== 인증서 체인 로드 ===");
        System.out.println("인증서 " + certs.size() + "개 발견\n");

        for (int i = 0; i < certs.size(); i++) {
            X509Certificate cert = certs.get(i);
            System.out.println("[" + i + "] " + cert.getSubjectX500Principal().getName());
        }
        System.out.println();

        // 체인 서명 검증
        System.out.println("=== 체인 서명 검증 ===\n");

        for (int i = 0; i < certs.size(); i++) {
            X509Certificate cert = certs.get(i);
            String subject = getCommonName(cert.getSubjectX500Principal().getName());
            String issuer = getCommonName(cert.getIssuerX500Principal().getName());

            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("[인증서 " + i + "] " + subject);
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("  Subject: " + subject);
            System.out.println("  Issuer : " + issuer);
            System.out.println("  서명 알고리즘: " + cert.getSigAlgName());

            // 서명자 인증서 찾기
            X509Certificate signerCert = findSignerCert(cert, certs);

            if (signerCert == null) {
                // 자체 서명 확인
                if (subject.equals(issuer)) {
                    System.out.println("\n  >> 자체 서명 인증서 (루트 CA)");
                    System.out.println("  >> 검증: 자신의 공개키로 서명 확인");
                    verifySignature(cert, cert.getPublicKey(), subject);
                } else {
                    System.out.println("\n  >> 서명자 인증서를 체인에서 찾을 수 없음");
                    System.out.println("  >> 결과: 검증 불가\n");
                }
            } else {
                String signerName = getCommonName(signerCert.getSubjectX500Principal().getName());
                System.out.println("\n  >> 서명자: " + signerName);
                System.out.println("  >> 검증: 서명자의 공개키로 서명 확인");
                verifySignature(cert, signerCert.getPublicKey(), signerName);
            }
        }

        // 루트 CA 신뢰 검증
        System.out.println("=== 루트 CA 신뢰 검증 ===\n");
        X509Certificate rootCert = certs.get(certs.size() - 1);
        verifyTrustedCA(rootCert);

        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        System.out.println("검증 완료");
        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    private static void verifyTrustedCA(X509Certificate rootCert) {
        String rootCN = getCommonName(rootCert.getSubjectX500Principal().getName());
        System.out.println("루트 CA: " + rootCN);
        System.out.println("Trust Store 경로: " + System.getProperty("java.home") + "/lib/security/cacerts\n");

        try {
            // Java 기본 Trust Store 로드
            String cacertsPath = System.getProperty("java.home") + "/lib/security/cacerts";
            KeyStore trustStore = KeyStore.getInstance("JKS");
            trustStore.load(new FileInputStream(cacertsPath), "changeit".toCharArray());

            // Trust Store에서 루트 CA 찾기
            boolean found = false;
            String foundAlias = null;

            Enumeration<String> aliases = trustStore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                if (trustStore.isCertificateEntry(alias)) {
                    X509Certificate trustedCert = (X509Certificate) trustStore.getCertificate(alias);
                    if (trustedCert.getSubjectX500Principal().equals(rootCert.getSubjectX500Principal())) {
                        found = true;
                        foundAlias = alias;
                        break;
                    }
                }
            }

            if (found) {
                System.out.println(">> 결과: 신뢰할 수 있음");
                System.out.println(">> Trust Store alias: " + foundAlias);
            } else {
                System.out.println(">> 결과: Trust Store에서 찾을 수 없음");
                System.out.println(">> 이 루트 CA는 시스템에서 신뢰하지 않습니다.");
            }
        } catch (Exception e) {
            System.out.println(">> Trust Store 로드 실패: " + e.getMessage());
        }
        System.out.println();
    }

    private static void verifySignature(X509Certificate cert, PublicKey publicKey, String signerName) {
        try {
            // 1. tbsCertificate (서명 대상 데이터)
            byte[] tbsCert = cert.getTBSCertificate();
            System.out.println("\n  [서명 대상: tbsCertificate]");
            System.out.println("    길이: " + tbsCert.length + " bytes");
            System.out.println("    앞부분: " + bytesToHex(tbsCert, 20) + "...");

            // 2. tbsCertificate의 해시값
            String sigAlg = cert.getSigAlgName();
            String hashAlg = getHashAlgorithm(sigAlg);
            MessageDigest md = MessageDigest.getInstance(hashAlg);
            byte[] hash = md.digest(tbsCert);
            System.out.println("\n  [해시 (" + hashAlg + ")]");
            System.out.println("    " + bytesToHex(hash, hash.length));

            // 3. 서명값
            byte[] signature = cert.getSignature();
            System.out.println("\n  [서명값 (signatureValue)]");
            System.out.println("    길이: " + signature.length + " bytes");
            System.out.println("    앞부분: " + bytesToHex(signature, 20) + "...");

            // 4. 검증에 사용할 공개키
            System.out.println("\n  [검증 공개키]");
            System.out.println("    알고리즘: " + publicKey.getAlgorithm());
            if (publicKey instanceof RSAPublicKey) {
                RSAPublicKey rsaKey = (RSAPublicKey) publicKey;
                System.out.println("    키 길이: " + rsaKey.getModulus().bitLength() + " bits");
                String modHex = rsaKey.getModulus().toString(16).toUpperCase();
                System.out.println("    Modulus (앞 40자): " + modHex.substring(0, Math.min(40, modHex.length())) + "...");
            }

            // 5. 검증 수행
            cert.verify(publicKey);
            System.out.println("\n  >> 결과: 성공 - 서명이 유효함\n");
        } catch (Exception e) {
            System.out.println("\n  >> 결과: 실패 - " + e.getMessage() + "\n");
        }
    }

    private static String getHashAlgorithm(String sigAlg) {
        if (sigAlg.contains("SHA256")) return "SHA-256";
        if (sigAlg.contains("SHA384")) return "SHA-384";
        if (sigAlg.contains("SHA512")) return "SHA-512";
        if (sigAlg.contains("SHA1")) return "SHA-1";
        return "SHA-256";
    }

    private static String bytesToHex(byte[] bytes, int limit) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(bytes.length, limit); i++) {
            sb.append(String.format("%02X", bytes[i]));
        }
        return sb.toString();
    }

    private static X509Certificate findSignerCert(X509Certificate cert, List<X509Certificate> certs) {
        String issuer = cert.getIssuerX500Principal().getName();
        String subject = cert.getSubjectX500Principal().getName();

        // 자체 서명이면 null 반환 (별도 처리)
        if (issuer.equals(subject)) {
            return null;
        }

        // Issuer와 Subject가 일치하는 인증서 찾기
        for (X509Certificate candidate : certs) {
            if (candidate.getSubjectX500Principal().getName().equals(issuer)) {
                return candidate;
            }
        }
        return null;
    }

    private static String getCommonName(String dn) {
        for (String part : dn.split(",")) {
            if (part.trim().startsWith("CN=")) {
                return part.trim().substring(3);
            }
        }
        return dn;
    }

    private static List<X509Certificate> parseCertificates(String pemContent) throws Exception {
        List<X509Certificate> certs = new ArrayList<>();
        CertificateFactory factory = CertificateFactory.getInstance("X.509");

        String BEGIN = "-----BEGIN CERTIFICATE-----";
        String END = "-----END CERTIFICATE-----";

        int start = 0;
        while ((start = pemContent.indexOf(BEGIN, start)) != -1) {
            int end = pemContent.indexOf(END, start);
            if (end == -1) break;

            String base64 = pemContent.substring(start + BEGIN.length(), end)
                    .replaceAll("\\s", "");
            byte[] derBytes = Base64.getDecoder().decode(base64);

            ByteArrayInputStream bis = new ByteArrayInputStream(derBytes);
            X509Certificate cert = (X509Certificate) factory.generateCertificate(bis);
            certs.add(cert);

            start = end + END.length();
        }
        return certs;
    }
}