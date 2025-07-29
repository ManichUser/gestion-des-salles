import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';

import { getSalleDeClasse } from '../services/classRoomService';
import { userExample } from '../data/userData';
import { useSearchParams } from 'expo-router/build/hooks';
import { Salle } from '../screens/RoomsListScreen';
import { router } from 'expo-router';

export default function HomePage() {
  const  user :string | null =  useSearchParams().get("user")||userExample.username  ;

  const [salles, setSalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const data: Salle[] =  await getSalleDeClasse();
        setSalles(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des salles :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, []);
  return (
    <View style={{ paddingTop: 50, backgroundColor: 'white', flex: 1, paddingHorizontal: 25 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Image style={{ width: 40, height: 40 }} source={require('@/assets/images/logo.png')} />
          <Text style={styles.title}>RoomWise</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', height: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold',color:'black' }}>{user}</Text>
          <Ionicons onPress={()=>router.push('/profil')} name='person-sharp' size={24} />
        </View>
      </View>

      <TextInput placeholder="Rechercher" style={styles.Input} />
      <Text style={styles.sectionTitle}>Récemment Libérées</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>
          {(salles as { id: number; nom: string; statut: string }[])
            .filter(salle => salle.statut.toUpperCase() === 'LIBRE')
            .map((salle) => (
              <TouchableOpacity key={salle.id} style={styles.roomCard}>
                <Text style={styles.roomName}>{salle.nom}</Text>
                <Text style={styles.status}>{salle.statut}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Commencer une réservation</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Merci d'utiliser l'application</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  Input: {
    width: '100%',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    marginBottom: 30,
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  scrollview: {
    width: '100%',
    height: 180,
    padding: 10,
  },
  roomName: {
    fontSize: 20,
  },
  status: {
    width: 50,
    height: 30,
    textAlign: 'center',
    padding: 5,
    color: 'green',
    fontWeight: 'bold',
    backgroundColor: '#dbfffa',
    borderRadius: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  footerText: {
    width: '100%',
    textAlign: 'center',
    marginVertical: 15,
    color: '#555',
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: '100%',
    height: 70,
    borderWidth: 1,
    borderColor: '#ebedf3',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
