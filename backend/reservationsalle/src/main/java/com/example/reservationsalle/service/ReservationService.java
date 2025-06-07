package com.example.reservationsalle.service;
import com.example.reservationsalle.clients.RoomServiceClient;
import com.example.reservationsalle.clients.UserServiceClient;
import com.example.reservationsalle.kafka.KafkaProducer;
import com.example.reservationsalle.repository.ReservationRepository;
import com.example.reservationsalle.model.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;
    @Autowired
    private RoomServiceClient roomServiceClient;
    @Autowired
    private UserServiceClient userServiceClient;
    @Autowired
    private KafkaProducer kafkaProducer;

    public Reservation createReservation(Reservation reservation) {
        String roomStatus = roomServiceClient.getRoomStatus(reservation.getRoomId()).block();
        if (!"LIBRE".equalsIgnoreCase(roomStatus)) {
            throw new RuntimeException("Salle non libre");
        }

        boolean isOwner = userServiceClient
            .getUserById(reservation.getReservedBy())
            .block()
            .filiere().equalsIgnoreCase(reservation.getFiliere()) &&
            userServiceClient
            .getUserById(reservation.getReservedBy())
            .block()
            .niveau().equalsIgnoreCase(reservation.getNiveau());

        if (!isOwner) {
            userServiceClient.getUserByFiliereNiveau(reservation.getFiliere(), reservation.getNiveau())
                .doOnNext(owner -> {
                    reservation.setStatus("PENDING");
                    Reservation saved = repository.save(reservation);
                    kafkaProducer.sendConfirmationRequest(
                        saved.getId(),
                        owner.email(),
                        "http://localhost:8080/confirmations/" + saved.getId()
                    );
                })
                .block();
            return reservation;
        } else {
            reservation.setStatus("ACCEPTED");
            return repository.save(reservation);
        }
    }

    public Reservation confirmReservation(Long id, boolean accepted) {
        Reservation reservation = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Not Found"));
        reservation.setStatus(accepted ? "ACCEPTED" : "REJECTED");
        return repository.save(reservation);
    }

    public Reservation getReservationById(Long id) {
    return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
}
    public void deleteReservation(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Reservation not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    public Iterable<Reservation> getAllReservations() {
        return repository.findAll();
    }

}
