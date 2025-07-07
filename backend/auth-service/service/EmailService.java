package com.example.authentification_test.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private  final JavaMailSender mailSender;

    public void sendResetEmail(String toEmail, String resetLink){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset your password");
        message.setText("Good morning, \n\nClick on the link to reset your password : \n" + resetLink + "\n\n This link will expire in 30 minutes.");
        mailSender.send(message);
    }
}
