package com.example.authentification_test.security;
import com.example.authentification_test.model.User;

import io.jsonwebtoken.*;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secret}")
    private  String SECRET_KEY;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    private Key signingKey;

    @PostConstruct
    private void init(){
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role",user.getRole().getName());
        if (user.getStatus() != null){
            claims.put("status",user.getStatus().name());
        }


        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(signingKey,SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token){
        return extractClaim(token,Claims::getSubject);
    }
    public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));

    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
