package com.example.authentification_test.controller;

import com.example.authentification_test.dto.*;
import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.UserRespository;
import com.example.authentification_test.service.AuthService;
import com.example.authentification_test.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow requests from any origin
public class AuthController {
    private final AuthService authService;
    private final UserRespository userRespository;
    private final TokenService tokenService;

    public AuthController(AuthService authService, UserRespository userRespository, TokenService tokenService) {

        this.authService = authService;
        this.userRespository = userRespository;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse>
    register(@RequestBody RegisterRequest request){

        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Login utilisateur",description = "Genere un JWT et un refresh token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse>
    login(@RequestBody LoginRequest request){

        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/role/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody RoleUpdateRequest request){
        User user = userRespository.findById(userId).orElseThrow();
        user.setRole(request.getRole());
        userRespository.save(user);

        return ResponseEntity.ok("User role updated to" + request.getRole());
    }

    @PutMapping("/statut/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public  ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody StatusUpdateRequest request){
        User user = userRespository.findById(userId).orElseThrow();
        user.setStatus(request.getStatus());
        userRespository.save(user);

        return  ResponseEntity.ok("User status updated to" +request.getStatus());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userRespository.findAll());
    }

    @GetMapping("/users/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role){
        return ResponseEntity.ok(userRespository.findByRole(role));
    }

    @GetMapping("/users/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByStatus(@PathVariable Status status){
        return ResponseEntity.ok(userRespository.findByStatus(status));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest request){
        return tokenService.refreshToken(request.getRefreshToken())
                .map(response -> ResponseEntity.ok().body("Token refresh successfully"))
                .orElseGet(() ->
                        ResponseEntity.status(403).body("Invalid or expired refrrsh token"));
    }

}
