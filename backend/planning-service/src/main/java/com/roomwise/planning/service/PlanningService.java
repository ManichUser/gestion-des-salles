package com.roomwise.planning.service;

import com.roomwise.planning.dto.PlanningRequest;
import com.roomwise.planning.entity.Planning;

import java.time.LocalDate;
import java.util.List;

public interface PlanningService {
    Planning create(PlanningRequest request, Long adminId);
    List<Planning> getAll();
    Planning getById(Long id);
    Planning update(Long id, PlanningRequest request, Long adminId);
    void delete(Long id);
    List<Planning> getBySalle(Long salleId);
    List<Planning> getByDate(LocalDate date);
}
