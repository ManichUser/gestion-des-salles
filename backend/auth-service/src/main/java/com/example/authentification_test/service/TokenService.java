package com.example.authentification_test.service;

import com.example.authentification_test.dto.AuthResponse;
import com.example.authentification_test.model.RefreshToken;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.RefreshTokenRespository;
import com.example.authentification_test.respository.UserRespository;
import com.example.authentification_test.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final RefreshTokenRespository refreshTokenRespository;
    private final UserRespository userRespository;
    private final JwtService jwtService;

    @Value("${jwt.refresh.expiration}")
    private int refreshTokenDurationMs;

    public RefreshToken createRefreshToken(User user){
        refreshTokenRespository.deleteByUser(user); //one token per user

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();

        return refreshTokenRespository.save(token);
    }

    public boolean isValid(RefreshToken token){
        return token.getExpiryDate().isAfter(Instant.now());
    }

    public void deleteRefreshToken(RefreshToken token){
        refreshTokenRespository.delete(token);
    }

    public Optional<AuthResponse>
    refreshToken(String token){
        return refreshTokenRespository.findByToken(token)
                .filter(this::isValid)
                .map(refreshToken -> {
                    User user = refreshToken.getUser();
                    String newJwt = jwtService.generateToken(user);
                    return AuthResponse.builder()
                            .token(newJwt)
                            .build();
                });
    }
}
