package com.example.reservationsalle.repository;
import com.example.reservationsalle.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
