package com.example.authentification_test.config; // Adaptez ce package à votre structure

import com.example.authentification_test.model.Role;
import com.example.authentification_test.respository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Vérifie si le rôle "USER" existe déjà avant de l'insérer
        if (roleRepository.findByName("USER").isEmpty()) {
            System.out.println("user en creation");
            roleRepository.save(new Role(null, "USER"));
            System.out.println("User created");
        }
        // Vous pouvez ajouter d'autres rôles de la même manière
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ADMIN"));
        }
        if (roleRepository.findByName("DELEGUE").isEmpty()) {
            roleRepository.save(new Role(null, "DELEGUE"));
        }
        
    }
}