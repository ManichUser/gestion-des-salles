package com.example.authentification_test.config;

import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.RoleRepository;
import com.example.authentification_test.respository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository) {

        return args -> {
            if (userRepository.findByEmail("uds@gmail.com").isEmpty()) {
                
                // Créer le rôle ADMIN s’il n’existe pas
                if (!roleRepository.existsByName("ADMIN")) {
                    roleRepository.save(new Role(null, "ADMIN"));
                }

                // Récupérer le rôle ADMIN
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Le rôle ADMIN est introuvable"));

                // Créer l'utilisateur admin
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("uds@gmail.com");
                admin.setPassword(passwordEncoder.encode("1234admin"));
                admin.setRole(adminRole);
                admin.setEnabled(true);
                admin.setStatus(Status.ACTIF);

                userRepository.save(admin);
                System.out.println(" Admin créé avec succès !");
            } else {
                System.out.println(" Admin déjà existant.");
            }
        };
    }
}
