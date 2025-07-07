package com.example.authentification_test.respository;

import com.example.authentification_test.model.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetRespository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByToken(String token);
}
