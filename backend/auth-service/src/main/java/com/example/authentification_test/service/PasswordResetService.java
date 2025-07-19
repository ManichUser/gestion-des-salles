package com.example.authentification_test.service;

import com.example.authentification_test.model.PasswordReset;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.PasswordResetRespository;
import com.example.authentification_test.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final PasswordResetRespository passwordResetRespository;
    private final UserRepository userRespository;
    private final EmailService emailService;

    public void sendResetToken(String email){
        User user = userRespository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordReset passwordReset = PasswordReset.builder()
                .token(token)
                .user(user)
                .expiryDate(Instant.now().plus(Duration.ofMinutes(30)))
                .used(false)
                .build();

        passwordResetRespository.save(passwordReset);

        //to do: envoyer par email ici dans la console
        //System.out.println("Link to reset password: hhtp://localhost:8080/api/auth/reset-password?token=" + token);
    String resetLink = "http://my-domain/reset-password?token = " + token;
    emailService.sendResetEmail(user.getEmail(),resetLink);
    }

    public void  resetPassword(String token, String newPassword){
        PasswordReset reset = passwordResetRespository.findByToken(token)
                .orElseThrow(()-> new RuntimeException("invalide token"));

        if (reset.isUsed() || reset.getExpiryDate().isBefore(Instant.now())){
            throw new RuntimeException("Token expired or already used");
        }

        User user = reset.getUser();
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        reset.setUsed(true);

        passwordResetRespository.save(reset);
        userRespository.save(user);
    }
}
