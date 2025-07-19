import React , { useEffect, useState } from 'react';
import { View, Text, StyleSheet , FlatList,Button, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Colors} from '../constants/Colors';
import { getSalleDeClasse } from '../services/classRoomService';
import { router } from 'expo-router';

export type Salle = {
    id: number;
    nom: string;
    statut: string;
  };

export const Rooms :Salle[] = [
  { id: 1, nom: 'Salle A', statut: 'LIBRE' },
  { id: 2, nom: 'Salle B', statut: 'RESERVEE' },
  { id: 3, nom: 'Amphi C', statut: 'LIBRE' },
  { id: 4, nom: 'Salle D', statut: 'OCCUPEE' },
  { id: 5, nom: 'Salle ', statut: 'LIBRE' },
  { id: 6, nom: 'Labo F10', statut: 'RESERVEE' },
  { id: 7, nom: 'Salle G', statut: 'LIBRE' },
  { id: 8, nom: 'Salle H', statut: 'OCCUPEE' },
  { id: 9, nom: 'Amphi I', statut: 'LIBRE' },
  { id: 10, nom: 'Salle J', statut: 'RESERVEE' },
  { id: 11, nom: 'Salle  k', statut: 'LIBRE' },
  { id: 12, nom: 'Salle ', statut: 'RESERVEE' },
  { id: 13, nom: 'Amphi M', statut: 'LIBRE' },
  { id: 14, nom: 'Salle N', statut: 'OCCUPEE' },
  { id: 15, nom: 'Salle O2', statut: 'LIBRE' },
  { id: 16, nom: 'Labo P10', statut: 'RESERVEE' },
  { id: 17, nom: 'Salle Q1', statut: 'LIBRE' },
  { id: 18, nom: 'Salle R2', statut: 'OCCUPEE' },
  { id: 19, nom: 'Amphi S300', statut: 'LIBRE' },
  { id: 20, nom: 'Salle T1', statut: 'RESERVEE' },
];


export default function RoomsListScreen() {
    const [salles, setSalles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'LIBRE':
        return Colors.status.libre;
      case 'RESERVEE':
        return Colors.status.reservee;
      case 'OCCUPEE':
        return Colors.status.occupee;
      default:
        return Colors.textSecondary;
    }
  };
  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const data:Salle[] =  await getSalleDeClasse();
        setSalles(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des salles :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, []);
  const openClass=(salle:Salle)=>{
    router.push({pathname:`../reservation/${salle.id.toString()}`,params:{nom:salle.nom}})
  }

  const renderRoomItem = ({ item }: { item: typeof Rooms[0] }) => (
    <View style={styles.roomItem}>
      <View style={styles.roomItemRow}>
        <Text style={styles.roomName}>{item.nom}</Text>
        <Text style={[styles.roomStatus, { color: getStatusColor(item.statut) }]}>
            {"Actuellement "+item.statut.toLowerCase()}
        </Text>
      </View>
      <TouchableOpacity  disabled={item.statut !== 'LIBRE'&& item.statut !== 'RESERVEE'}
     onPress={()=>openClass(item)} 
      style={[
        styles.button,
        item.statut === 'OCCUPEE' && { backgroundColor: 'lightgray' }
      ]}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Voir le planning</Text>
      </TouchableOpacity>
    </View>
  );



return (
    <View style={styles.container}>
    
    {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
    ) : (
    <FlatList
    data={salles} 
    renderItem={renderRoomItem}
    keyExtractor={(item) => item.id.toString()}
    style={{ width: '100%' }}
    contentContainerStyle={{ paddingBottom: 20 }} 
    />
    )}
    
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: '100%',

    backgroundColor: Colors.background,
    paddingBottom: 40,
  },
  roomItem: {
    backgroundColor: Colors.cardBackground,
    width: '100%',
    padding: 10,
    height: 110,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'column',
    gap: 10,
    borderBottomWidth: 0.5, 
    borderBottomColor: Colors.textSecondary,
  },
  roomItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  roomStatus: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});