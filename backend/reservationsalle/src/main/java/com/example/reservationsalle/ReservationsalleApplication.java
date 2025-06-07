package com.example.reservationsalle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class ReservationsalleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReservationsalleApplication.class, args);
		

	}
	
}
