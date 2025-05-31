package com.example.authentification_test.config;

import com.example.authentification_test.model.Role;
import com.example.authentification_test.respository.UserRespository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.authentification_test.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class AdminIntializer {

    @Bean
    CommandLineRunner
    createAdmin(UserRespository userRespository, PasswordEncoder passwordEncoder){
        return args -> {
           if (userRespository.findByEmail("uds@gmail.com").isEmpty()){
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("uds@gmail.com");
                admin.setPassword(passwordEncoder.encode("1234admin"));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                userRespository.save(admin);

                System.out.println("Admin created");
            }
        };
    }
}
