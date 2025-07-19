package com.example.authentification_test.controller;

import com.example.authentification_test.dto.*;
import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.UserRepository;
import com.example.authentification_test.service.AdminService;
import com.example.authentification_test.service.AuthService;
import com.example.authentification_test.service.PasswordResetService;
import com.example.authentification_test.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRespository;
    private final TokenService tokenService;
    private final AdminService adminService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, UserRepository userRespository, TokenService tokenService,AdminService adminService,PasswordResetService passwordResetService) {

        this.authService = authService;
        this.userRespository = userRespository;
        this.tokenService = tokenService;
        this.adminService=adminService;
        this.passwordResetService = passwordResetService;
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

    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<UserResponseDto> getAuthenticatedUser() {
        UserResponseDto userDetails = authService.getAuthenticatedUserDetails();
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        }
        return ResponseEntity.ok(userDetails);
    }

    @PutMapping("/role/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody RoleUpdateRequest request){
        User update = adminService.updateUserRole(userId,request.getRole());
        return ResponseEntity.ok("role updated to : " + update.getRole().getName());
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

    @PostMapping("/logout")
    public ResponseEntity<String>
    logout(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return ResponseEntity.badRequest().body("Missing token");
        }

        String token = authHeader.substring(7);

        tokenService.revokedAllTokenByUser(token);

        return ResponseEntity.ok("successfull logout");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String>
    forgotPassword(@RequestParam String email){
        passwordResetService.sendResetToken(email);
        return ResponseEntity.ok("link of password reset send");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String>
    resetPassword(@RequestParam String token, @RequestParam String newPassword){
        passwordResetService.resetPassword(token,newPassword);
        return ResponseEntity.ok("Password reset");
    }

}
