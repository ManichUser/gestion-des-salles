package com.example.reservationsalle.clients;


import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class RoomServiceClient {

    private final WebClient webClient = WebClient.create("http://room-service");

    public Mono<String> getRoomStatus(Long roomId) {
        return webClient.get()
                .uri("/rooms/" + roomId)
                .retrieve()
                .bodyToMono(String.class);
    }
}
