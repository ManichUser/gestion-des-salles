package com.example.classroom_service.config;

import com.example.classroom_service.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/classrooms/**").hasAnyRole("ADMIN","DELEGUE","USER")
                        .requestMatchers(HttpMethod.POST,"/api/classrooms").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/classrooms/{id}/statut").hasAnyRole("ADMIN","DELEGUE")
                        .requestMatchers(HttpMethod.PUT,"/api/classrooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/api/classrooms/**").hasRole("ADMIN")
                        .anyRequest().authenticated()).sessionManagement(sess ->sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)).formLogin(login -> login.disable()).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
