package com.roomwise.planning.service.impl;

import com.roomwise.planning.dto.PlanningRequest;
import com.roomwise.planning.dto.RoomDto;
import com.roomwise.planning.entity.Planning;
import com.roomwise.planning.repository.PlanningRepository;
import com.roomwise.planning.service.PlanningService;
import com.roomwise.planning.service.external.RoomClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanningServiceImpl implements PlanningService {

    private final PlanningRepository planningRepo;
    private final RoomClient roomClient;

    @Override
    public Planning create(PlanningRequest req, Long adminId) {
        // Vérifier si la salle existe
        RoomDto room = roomClient.getRoomById(req.getSalleId());
        if (room == null) throw new RuntimeException("Salle introuvable");

        // Conflit horaire ?
        boolean conflit = planningRepo.hasConflict(req.getSalleId(), req.getDate(), req.getHeureDebut(), req.getHeureFin());
        if (conflit) throw new RuntimeException("Conflit de réservation");

        Planning p = new Planning(null, req.getDate(), req.getHeureDebut(), req.getHeureFin(),
                req.getCours(), req.getProprietaireFiliere(), req.getProprietaireNiveau(),
                req.getSalleId(), adminId);
        return planningRepo.save(p);
    }

    @Override
    public List<Planning> getAll() { return planningRepo.findAll(); }

    @Override
    public Planning getById(Long id) {
        return planningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Planning non trouvé"));
    }

    @Override
    public Planning update(Long id, PlanningRequest req, Long adminId) {
        Planning p = getById(id);
        boolean conflit = planningRepo.hasConflict(req.getSalleId(), req.getDate(), req.getHeureDebut(), req.getHeureFin());
        if (conflit) throw new RuntimeException("Conflit de réservation");
        p.setDate(req.getDate());
        p.setHeureDebut(req.getHeureDebut());
        p.setHeureFin(req.getHeureFin());
        p.setCours(req.getCours());
        p.setProprietaireFiliere(req.getProprietaireFiliere());
        p.setProprietaireNiveau(req.getProprietaireNiveau());
        p.setSalleId(req.getSalleId());
        p.setAdminId(adminId);
        return planningRepo.save(p);
    }

    @Override
    public void delete(Long id) { planningRepo.deleteById(id); }

    @Override
    public List<Planning> getBySalle(Long salleId) { return planningRepo.findBySalleId(salleId); }

    @Override
    public List<Planning> getByDate(LocalDate date) { return planningRepo.findByDate(date); }
}
