package com.example.authentification_test.config;

import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.respository.RoleRespository;
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
    createAdmin(UserRespository userRespository, PasswordEncoder passwordEncoder, RoleRespository roleRespository){
        return args -> {
           if (userRespository.findByEmail("uds@gmail.com").isEmpty()){
               Role adminRole = roleRespository.findByName("ADMIN")
                       .orElseThrow(()-> new RuntimeException("Role ADMIN introuvable"));

                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("uds@gmail.com");
                admin.setPassword(passwordEncoder.encode("1234admin"));
                admin.setRole(adminRole);
                admin.setEnabled(true);
                admin.setStatus(Status.ACTIF);
                userRespository.save(admin);

                System.out.println("Admin created");
            }
        };
    }
}
