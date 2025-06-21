package com.example.reservationsalle.controller;

import com.example.reservationsalle.model.Reservation;
import com.example.reservationsalle.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public Reservation reserve(@RequestBody Reservation reservation) {
        System.out.println("debut reservation");
        return reservationService.createReservation(reservation);
    }

    @PostMapping("/{id}/confirm")
    public Reservation confirmReservation(@PathVariable Long id, @RequestParam boolean accept) {
        return reservationService.confirmReservation(id, accept);
    }
}