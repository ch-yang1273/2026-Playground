package com.sudoku.security;

import com.sudoku.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  private final SecretKey secretKey;
  private final long expiration;

  public JwtUtil(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.expiration}") long expiration) {
    this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expiration = expiration;
  }

  public String generateToken(User user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    return Jwts.builder()
        .subject(user.getEmail())
        .claim("role", user.getRole().name())
        .claim("nickname", user.getNickname())
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(secretKey)
        .compact();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .verifyWith(secretKey)
          .build()
          .parseSignedClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public String extractEmail(String token) {
    return extractClaims(token).getSubject();
  }

  public Date extractExpiration(String token) {
    return extractClaims(token).getExpiration();
  }

  public String extractRole(String token) {
    return extractClaims(token).get("role", String.class);
  }

  private Claims extractClaims(String token) {
    return Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
