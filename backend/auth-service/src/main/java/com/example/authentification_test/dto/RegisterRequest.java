package com.example.authentification_test.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String Filiere;
    private String Niveau;
    private String username;
    private String email;
    private String password;

}
