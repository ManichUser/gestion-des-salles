package com.example.authentification_test.service;

import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.UserRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRespository userRespository;

    @Transactional
    public User updateUserRole(Long userId, Role newRole){
         User user = userRespository.findById(userId).orElseThrow(()->
                new RuntimeException("Utilisateur introuvable"));
         user.setRole(newRole);

         return userRespository.save(user);

    }
}
