package com.example.authentification_test.respository;

import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
       Optional<User> findByEmail(String email);
       List<User> findByRole(Role role);
       List<User> findByStatus(Status status);
       
}
