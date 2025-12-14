package com.fit.config;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    // 🔐 Must be at least 32 characters
    private static final String SECRET_KEY =
            "lashdashdlkashdlkhqwoeashdhflksdhfl";

    private static final long EXPIRATION_TIME =
            1000 * 60 * 10; // 10 minutes

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(int userid) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userid", userid);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject("loginuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public int extractUserID(String token) {
        return getAllClaims(token).get("userid", Integer.class);
    }

    public boolean isTokenExpired(String token) {
        return getAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
