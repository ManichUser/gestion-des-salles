
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import {  filterByFiliereEtNiveau, reservationData } from '../data/reservationData';
import { user } from '../data/userData';
import { cancelReservation, getReservations } from '../services/reservationService';
import { getAuthenticatedUser } from '../services/authService';


export default function ReservationScreen() {
  const [reservations, setReservations] = useState<reservationData[]>([]);
  const [user,setUser]=useState<user>()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlannings = async () => {
        try {
            const data: reservationData[] = await getReservations();
            const authenticatedUser: user = await getAuthenticatedUser(); 
            setUser(authenticatedUser);
            const filteredReservation=filterByFiliereEtNiveau(authenticatedUser?.filiere,authenticatedUser?.niveau,data)
            setReservations(filteredReservation);
        } catch (err) {
            console.log('Erreur lors de la recuperation des reservations', err);
        }finally{
            setLoading(false)
        }
    };
    fetchPlannings();
}, []);

  const handleCancelReservation = (id: number) => {
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
          onPress: async () => {
            
          const cancel =await cancelReservation(id);
          console.log(cancel)
            Alert.alert("Succès", "Réservation annulée.");
            const data: reservationData[] = await getReservations();
            setReservations(data)
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
                res.id.toString() === id ? { ...res, statut: 'Occupée' } : res
              )
            );
            Alert.alert("Succès", "Salle marquée comme occupée.");
          }
        }
      ]
    );
  };

const renderReservationItem = ({ item }: { item: reservationData }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.salleReserver}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Heure: {item.heureDebut} - {item.heureFin}</Text>
      <Text>Motif: {item.coursPrevu}</Text>
  
      {user?.roleName === 'DELEGUE' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => handleCancelReservation(item.id)}
          >
            <Text style={styles.buttonText}>Annuler la réservation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.occupiedButton]}
            onPress={() => handleSetOccupied(item.id.toString())}
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
      {loading?(<ActivityIndicator color="#2563eb" style={{ marginTop: 50 }} size={40}/>)
      :(reservations.length === 0 ? (
        <Text style={styles.noReservationsText}>Vous n'avez aucune réservation.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReservationItem}
          contentContainerStyle={styles.listContent}
        />
      ))}
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
    backgroundColor: '#dc3545', 
  },
  occupiedButton: {
    backgroundColor: '#0959e4', 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12, 
  },
  noReservationsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#555',
  },
});