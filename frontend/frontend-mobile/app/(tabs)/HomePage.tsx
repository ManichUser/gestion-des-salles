import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,Image  } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HomePage(){
  const salles=[
            { id:1,
              nomSalle:'salle A',
              status:'Libre'
            },
            {
              id:2,
              nomSalle:'salle B',
              status:'Libre'
            },
            {
              id:3,
              nomSalle:'salle C',
              status:'Libre',
            },
            {
              id:4,
              nomSalle:'salle D',
              status:'Libre',
            },
              {
              id:5,
              nomSalle:'salle E',
              status:'Libre',
            },
              {
              id:6,
              nomSalle:'salle F',
              status:'Libre',
            },
              {
              id:7,
              nomSalle:'salle G',
              status:'Libre',
            }

  ]
  const {user}=useLocalSearchParams();
  const router=useRouter()
  return (
    <View style={{paddingTop:50,backgroundColor:'white' ,flex:1,paddingHorizontal:25}}>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:25}}>
        <View style={{display:'flex',flexDirection:'row',gap:10,alignItems:'center'}}>
          <Image style={{width:40,height:40}} source={require('@/assets/images/logo.png')} />
          <Text style={styles.title}>RoomWise</Text>
      </View>
        <View style={{display:'flex',flexDirection:'row',gap:10,alignItems:'center',height:40}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>{user}</Text>
        <Ionicons name='person-sharp' size={24} />
      </View>
      </View>
      
      <TextInput placeholder="Rechercher"style={styles.Input} />
      <Text style={styles.sectionTitle}>Récemment Libérées</Text>
      <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>
        {salles.map((salle)=>(
          <TouchableOpacity key={salle.id} style={styles.roomCard}>
            <Text style={styles.roomName}>{salle.nomSalle}</Text>
              <Text style={styles.status}>{salle.status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Commencer une réservation</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>{"Merci d'utiliser l'application  "} </Text>


    </View>
    
  );
}
  
  

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
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
    fontSize:20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  scrollview:{
    width:'100%',
    height:180,
    padding:10,
  },
  roomContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 20,
  },
  status: {
    width:50,
    height:30,
    textAlign:'center',
    padding:5,
    color: 'green',
    fontWeight: 'bold',
    backgroundColor:'#dbfffa',
    borderRadius:10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems:'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:20,
  },
  footerText: {
    width:'100%',
    textAlign:'center',
    marginVertical: 15,
    color: '#555',
  },
 
  roomCard:{
    backgroundColor:'white',
    borderRadius:15,
    padding:20,
    marginBottom:15,
    width:'100%',
    height:70,
    borderWidth:1,
    borderColor:'#ebedf3',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
  }
});


