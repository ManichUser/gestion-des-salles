package com.example.authentification_test.service;

import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.RoleRepository;
import com.example.authentification_test.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRespository;
    private final RoleRepository roleRespository;

    @Transactional
    public User updateUserRole(Long userId, String newRole){
         User user = userRespository.findById(userId).orElseThrow(()->
                new RuntimeException("Utilisateur introuvable"));

         Role role =roleRespository.findByName(newRole.toUpperCase())
                         .orElseThrow(() -> new RuntimeException("Role introuvable"));
         user.setRole(role);

         return userRespository.save(user);

    }
}
