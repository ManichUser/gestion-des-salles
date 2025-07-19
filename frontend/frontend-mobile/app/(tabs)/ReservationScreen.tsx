// ReservationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

// Données statiques de réservation pour un délégué
const initialReservations = [
  {
    id: '1',
    salle: 'Amphi 351 Campus A',
    date: '2025-07-20',
    heureDebut: '09:00',
    heureFin: '11:00',
    statut: 'Confirmée', // Confirmée, Annulée, Occupée
    motif: 'Cours de Maths',
  },
  {
    id: '2',
    salle: 'Salle BI-1 Campus A',
    date: '2025-07-21',
    heureDebut: '14:00',
    heureFin: '16:00',
    statut: 'Confirmée',
    motif: 'TD de Physique',
  },
  {
    id: '3',
    salle: 'Amphi 600 Campus C',
    date: '2025-07-22',
    heureDebut: '10:00',
    heureFin: '12:00',
    statut: 'Annulée',
    motif: 'Réunion annulée',
  },
  {
    id: '4',
    salle: 'Salle NS3 Campus C',
    date: '2025-07-23',
    heureDebut: '08:00',
    heureFin: '10:00',
    statut: 'Occupée',
    motif: 'Examen',
  },
];

export default function ReservationScreen() {
  const [reservations, setReservations] = useState(initialReservations);

  const handleCancelReservation = (id: string) => {
    Alert.alert(
      "Annuler la réservation",
      "Êtes-vous sûr de vouloir annuler cette réservation ?",
      [
        {
          text: "Non",
          style: "cancel"
        },
        {
          text: "Oui",
          onPress: () => {
            setReservations(prevReservations =>
              prevReservations.map(res =>
                res.id === id ? { ...res, statut: 'Annulée' } : res
              )
            );
            Alert.alert("Succès", "Réservation annulée.");
          }
        }
      ]
    );
  };

  const handleSetOccupied = (id:string) => {
    Alert.alert(
      "Marquer comme Occupée",
      "Êtes-vous sûr de vouloir marquer cette salle comme occupée ?",
      [
        {
          text: "Non",
          style: "cancel"
        },
        {
          text: "Oui",
          onPress: () => {
            setReservations(prevReservations =>
              prevReservations.map(res =>
                res.id === id ? { ...res, statut: 'Occupée' } : res
              )
            );
            Alert.alert("Succès", "Salle marquée comme occupée.");
          }
        }
      ]
    );
  };

const renderReservationItem = ({ item }: { item: { id: string; salle: string; date: string; heureDebut: string; heureFin: string; statut: string; motif: string; } }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.salle}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Heure: {item.heureDebut} - {item.heureFin}</Text>
      <Text>Motif: {item.motif}</Text>
    <Text style={[styles.statusText, styles[`status_${item.statut as 'confirmée' | 'annulée' | 'occupée'}`]]}>
        Statut: {item.statut}
    </Text>
      {item.statut === 'Confirmée' && ( // N'afficher les boutons que si la réservation est confirmée
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => handleCancelReservation(item.id)}
          >
            <Text style={styles.buttonText}>Annuler la réservation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.occupiedButton]}
            onPress={() => handleSetOccupied(item.id)}
          >
            <Text style={styles.buttonText}>Mettre la salle comme occupée</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mes Réservations</Text>
      {reservations.length === 0 ? (
        <Text style={styles.noReservationsText}>Vous n'avez aucune réservation.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={renderReservationItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#14467a',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  statusText: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  status_confirmée: {
    color: 'green',
  },
  status_annulée: {
    color: 'red',
  },
  status_occupée: {
    color: 'orange',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Rouge pour annuler
  },
  occupiedButton: {
    backgroundColor: '#ffc107', // Jaune/Orange pour occuper
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12, // Taille de police légèrement réduite pour s'adapter
  },
  noReservationsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#555',
  },
});