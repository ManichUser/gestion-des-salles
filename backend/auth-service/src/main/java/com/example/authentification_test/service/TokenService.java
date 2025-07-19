package com.example.authentification_test.service;

import com.example.authentification_test.dto.AuthResponse;
import com.example.authentification_test.model.RefreshToken;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.RefreshTokenRespository;
import com.example.authentification_test.respository.UserRepository;
import com.example.authentification_test.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final RefreshTokenRespository refreshTokenRespository;
    private final UserRepository userRespository;
    private final JwtService jwtService;

    @Value("${jwt.refresh.expiration}")
    private int refreshTokenDurationMs;

    @Transactional
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

    public  void  revokedAllTokenByUser(String jwt){
        String username = jwtService.extractUsername(jwt);
        User user = userRespository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //supression complete (option 1)
        //refreshTokenRespository.deleteByUser(user);

        //marque comme revoquer pour garder l'historique des token (option 2)
        List<RefreshToken> tokens = refreshTokenRespository.findAllByUser(user);
        for (RefreshToken token : tokens){
            token.setRevokedT(true);
        }
        refreshTokenRespository.saveAll(tokens);
    }

    public boolean isTokenRevoked(String jwt){
        return refreshTokenRespository.findByToken(jwt)
                .map(RefreshToken :: isRevokedT)
                .orElse(true); //considerer invalid par defaut
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
