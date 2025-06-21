package com.example.reservationsalle.controller;

import com.example.reservationsalle.model.Reservation;
import com.example.reservationsalle.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/confirmations")
public class ConfirmationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping("/{id}")
    public Reservation confirm(@PathVariable Long id, @RequestParam boolean accept) {
        return reservationService.confirmReservation(id, accept);
    }
}

