package com.example.authentification_test.config;

import com.example.authentification_test.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; // <-- NOUVEL IMPORT
import org.springframework.web.cors.CorsConfigurationSource; // <-- NOUVEL IMPORT
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // <-- NOUVEL IMPORT
import java.util.Arrays; // <-- NOUVEL IMPORT

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Nouvelle syntaxe
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- AJOUTEZ CETTE LIGNE POUR CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/swagger-resources/**",
                                "/webjars/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/logout",
                                "/api/auth/refresh", // Permettre le refresh token aussi
                                "/api/auth/forgot-password", // Permettre l'accès à ces endpoints
                                "/api/auth/reset-password",  // sans authentification
                                "/api/classrooms/**",        // Si vos endpoints de salles sont publics
                                "/api/statiqueplannings/**"  // Si vos endpoints de plannings sont publics
                        ).permitAll()
                        .requestMatchers("/api/auth/role/**", "/api/auth/statut/**", "/api/auth/users/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // pour acceder a la h2 en memoire
        http.headers(AbstractHttpConfigurer::disable);

        return http.build();
    }

    // NOUVEAU BEAN POUR LA CONFIGURATION CORS
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // REMPLACEZ "http://localhost:3000" par l'origine exacte de votre application Next.js
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // L'URL de votre frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Méthodes HTTP autorisées
        configuration.setAllowedHeaders(Arrays.asList("*")); // Autorise tous les en-têtes
        configuration.setAllowCredentials(true); // Autorise l'envoi de cookies et d'en-têtes d'autorisation
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Applique cette configuration CORS à TOUS les chemins (/**)
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}