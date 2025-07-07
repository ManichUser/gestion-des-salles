package com.example.authentification_test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement //pour plusieurs operation
public class AuthentificationTestApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthentificationTestApplication.class, args);
	}

}
