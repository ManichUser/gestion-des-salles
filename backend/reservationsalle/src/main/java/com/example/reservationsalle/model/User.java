package com.example.reservationsalle.model;
// src/main/java/com/reservationservice/model/User.java

public class User {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String filiere;
    private String niveau;
    private String role;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

