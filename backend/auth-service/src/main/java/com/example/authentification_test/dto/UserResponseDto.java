// src/main/java/com/example/authentification_test/dto/UserResponseDto.java
package com.example.authentification_test.dto;

import com.example.authentification_test.model.Status; // Importez votre classe Status
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String firstname;
    private String lastname;
    private String filiere;
    private String niveau;
    private String roleName; 
    private Status status; 
    private boolean enabled; 
}