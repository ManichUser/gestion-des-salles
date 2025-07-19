package com.example.authentification_test.dto;

import lombok.*;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String username;
    private String email;

    }