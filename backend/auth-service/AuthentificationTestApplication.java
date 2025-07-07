package com.example.authentification_test;

import com.example.authentification_test.respository.RoleRespository;
import com.example.authentification_test.model.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement //pour plusieurs operation
public class AuthentificationTestApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthentificationTestApplication.class, args);
	}
	@Bean
	CommandLineRunner
	initRoles(RoleRespository roleRespository){
		return args -> {
			if (roleRespository.findByName("ADMIN").isEmpty()){
				roleRespository.save(Role.builder().name("ADMIN").build());
			}
			if(roleRespository.findByName("USER").isEmpty()){
				roleRespository.save(Role.builder().name("USER").build());
			}
			if(roleRespository.findByName("DELEGUE").isEmpty()){
				roleRespository.save(Role.builder().name("DELEGUE").build());
			}
		};
	}


}
