package com.roomwise.planning.controller;

import com.roomwise.planning.dto.PlanningRequest;
import com.roomwise.planning.dto.UserDto;
import com.roomwise.planning.entity.Planning;
import com.roomwise.planning.service.PlanningService;
import com.roomwise.planning.service.external.AuthClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/planning")
@RequiredArgsConstructor
public class PlanningController {

    private final PlanningService planningService;
    private final AuthClient authClient;

    // ✅ Méthode pour extraire le token et vérifier le rôle
    private UserDto getAuthenticatedAdmin(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token manquant");
        }

        UserDto user = authClient.getCurrentUser(token);
        if (!"ADMIN".equalsIgnoreCase(String.valueOf(user.getRole()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul un administrateur peut effectuer cette action");
        }
        return user;
    }

    @PostMapping
    public Planning create(@RequestBody PlanningRequest request, HttpServletRequest httpRequest) {
        UserDto admin = getAuthenticatedAdmin(httpRequest);
        return planningService.create(request, admin.getId());
    }

    @GetMapping
    public List<Planning> getAll(HttpServletRequest httpRequest) {
        getAuthenticatedAdmin(httpRequest);
        return planningService.getAll();
    }

    @GetMapping("/{id}")
    public Planning getById(@PathVariable Long id, HttpServletRequest httpRequest) {
        getAuthenticatedAdmin(httpRequest);
        return planningService.getById(id);
    }

    @PutMapping("/{id}")
    public Planning update(@PathVariable Long id, @RequestBody PlanningRequest request, HttpServletRequest httpRequest) {
        UserDto admin = getAuthenticatedAdmin(httpRequest);
        return planningService.update(id, request, admin.getId());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, HttpServletRequest httpRequest) {
        getAuthenticatedAdmin(httpRequest);
        planningService.delete(id);
    }

    @GetMapping("/salle/{salleId}")
    public List<Planning> getBySalle(@PathVariable Long salleId, HttpServletRequest httpRequest) {
        getAuthenticatedAdmin(httpRequest);
        return planningService.getBySalle(salleId);
    }

    @GetMapping("/date/{date}")
    public List<Planning> getByDate(@PathVariable LocalDate date, HttpServletRequest httpRequest) {
        getAuthenticatedAdmin(httpRequest);
        return planningService.getByDate(date);
    }
}
