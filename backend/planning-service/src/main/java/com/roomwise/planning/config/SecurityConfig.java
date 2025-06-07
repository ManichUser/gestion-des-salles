package com.roomwise.planning.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity(prePostEnabled = true) // utile si tu utilises @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // désactiver CSRF pour les appels API
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // autoriser tout (vérification du token faite via Feign)
                );
        return http.build();
    }
}
