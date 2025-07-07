package com.example.authentification_test.service;

import com.example.authentification_test.dto.AuthResponse;
import com.example.authentification_test.dto.LoginRequest;
import com.example.authentification_test.dto.RegisterRequest;
import com.example.authentification_test.model.RefreshToken;
import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.RoleRespository;
import com.example.authentification_test.respository.UserRespository;
import com.example.authentification_test.security.JwtService;
import lombok.Builder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Builder
@Service
public class AuthService {
    private final UserRespository userRespository;
    private final RoleRespository roleRespository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager; // ✅

    public AuthService(UserRespository userRespository,
                       RoleRespository roleRespository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,TokenService tokenService,
                       AuthenticationManager authenticationManager) {
        this.userRespository = userRespository;
        this.roleRespository = roleRespository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager; // ✅
    }

    public AuthResponse register(RegisterRequest request) {
        Role userRole = roleRespository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER introuvable"));

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setFiliere(request.getFiliere());
        user.setNiveau(request.getNiveau());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setEnabled(true);
        user.setStatus(Status.PASSIF);
        userRespository.save(user);

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetailsImpl userDetails =(UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        String jwtToken = jwtService.generateToken(user);
        RefreshToken refresh = tokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refresh.getToken())
                .build();
    }
}
