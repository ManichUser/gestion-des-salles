package com.example.reservationsalle.clients;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class UserServiceClient {

    private final WebClient webClient = WebClient.create("http://user-service");

    public Mono<User> getUserByFiliereNiveau(String filiere, String niveau) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/users")
                        .queryParam("filiere", filiere)
                        .queryParam("niveau", niveau)
                        .queryParam("role", "DELEGUE")
                        .build())
                .retrieve()
                .bodyToMono(User.class);
    }

    public Mono<User> getUserById(Long userId) {
        return webClient.get()
                .uri("/users/" + userId)
                .retrieve()
                .bodyToMono(User.class);
    }

    public record User(Long id, String nom, String prenom, String email, String filiere, String niveau, String role) {}
}
