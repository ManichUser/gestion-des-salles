package com.example.classroom_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
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
public class JwtService {
    @Value("${jwt.secret}")
    private  String SECRET_KEY;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    private Key signingKey;

    @PostConstruct
    public void init(){
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }



    public String extractUsername(String token){

        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token){
        return extractAllClaims(token).get("role",String.class);
    }

    public boolean isTokenValid(String token) {
        try{
            extractAllClaims(token);
            return true;
        } catch (Exception e){
            return false;
        }
    }


    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token,Function<Claims,T> resolver){
        return resolver.apply(extractAllClaims(token));
    }
}
