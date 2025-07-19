package com.roomwise.planning.controller;

import com.roomwise.planning.model.Planning;
import com.roomwise.planning.service.PlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/planning/reservations")
@CrossOrigin(origins = "*") 
public class PlanningController {

    @Autowired
    private PlanningService service;

    @PostMapping
    public ResponseEntity<Planning> create(@RequestBody Planning planning) {
        return new ResponseEntity<>(service.create(planning), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Planning> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Planning> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/delegue/{date}")
    public List<Planning> getPlanningsByDate(@PathVariable LocalDate date){
        return service.getPlanningsByDate(date);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Planning> update(@PathVariable Long id, @RequestBody Planning planning) {
        return ResponseEntity.ok(service.update(id, planning));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
