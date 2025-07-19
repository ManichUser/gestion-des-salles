package com.example.authentification_test.service;

import com.example.authentification_test.dto.AuthResponse;
import com.example.authentification_test.dto.LoginRequest;
import com.example.authentification_test.dto.RegisterRequest;
import com.example.authentification_test.model.RefreshToken;
import com.example.authentification_test.model.Role;
import com.example.authentification_test.model.Status;
import com.example.authentification_test.dto.UserResponseDto;
import com.example.authentification_test.model.User;
import com.example.authentification_test.respository.RoleRepository;
import com.example.authentification_test.respository.UserRepository;
import com.example.authentification_test.security.JwtService;
import lombok.Builder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Builder
@Service
public class AuthService {
    private final UserRepository userRespository;
    private final RoleRepository roleRespository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager; 

    public AuthService(UserRepository userRespository,
                       RoleRepository roleRespository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,TokenService tokenService,
                       AuthenticationManager authenticationManager) {
        this.userRespository = userRespository;
        this.roleRespository = roleRespository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager; 
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
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }


    public UserResponseDto getAuthenticatedUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            // Gérer le cas où l'utilisateur n'est pas authentifié ou est un anonyme
            return null; // Ou jeter une exception
        }

        // Le principal devrait être votre UserDetailsImpl personnalisé
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Mapper l'entité User vers le DTO de réponse
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .filiere(user.getFiliere())
                .niveau(user.getNiveau())
                .roleName(user.getRole() != null ? user.getRole().getName() : null) // Gérer le cas où le rôle est null
                .status(user.getStatus())
                .enabled(user.isEnabled())
                .build();
    }
}
