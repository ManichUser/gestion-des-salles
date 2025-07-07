import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getSalleDeClasse } from '@/app/services/authService'; 
import { router } from 'expo-router';

type Salle = {
  id: number;
  nom: string;
  statut: string;
};
const sampleData:Salle[]=[
  {
    id:1,
    nom:'NS3',
    statut:'LIBRE'
  },
  {
    id:2,
    nom:'NS2',
    statut:'LIBRE'
  },
  {
    id:3,
    nom:'Amphi 354',
    statut:'LIBRE'
  }
]
export default function Salle() {
  const [salles, setSalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const data:Salle[] = sampleData|| await getSalleDeClasse();
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

  const renderSalle = ({ item }: { item: Salle }) => (
    <View style={styles.salleCard}>
      <View style={styles.salleHead}>
        <Text style={styles.roomName}>{item.nom}</Text>
        <Text style={item.statut === 'LIBRE' ? styles.statuslibre : styles.statusOCC_RES}>
          {item.statut}
        </Text>
      </View>

      {item.statut !== 'OCCUPE' && (
        <TouchableOpacity onPress={()=>openClass(item)} style={styles.button}>
          <Text style={styles.buttonText}>Effectuer une reservation</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 50, paddingHorizontal: 15 }}>
      <Text style={styles.sectionTitle}>Liste des salles de classe</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={salles}
          renderItem={renderSalle}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  salleCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: '100%',
    height: 130,
    borderWidth: 1,
    borderColor: '#ebedf3',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  salleHead: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 20,
  },
  statuslibre: {
    width: 100,
    height: 30,
    textAlign: 'center',
    padding: 5,
    color: 'green',
    fontWeight: 'bold',
    backgroundColor: '#dbfffa',
    borderRadius: 10,
  },
  statusOCC_RES: {
    width: 100,
    height: 30,
    textAlign: 'center',
    padding: 5,
    color: 'red',
    fontWeight: 'bold',
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
