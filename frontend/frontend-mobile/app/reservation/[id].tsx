
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView, ScrollView,Platform } from 'react-native';
import { initialData } from '../data/userData';
import { router, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';


export default function ReservationScreen() {
    const [reservations, setReservations] = useState(initialData);
    const [heureDeb, setHeureDeb] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [date, setDate] = useState('');
    const {id, nom}=useLocalSearchParams()
    const handleReserve = () => {
        const newEntry = {
            id: (reservations.length + 1).toString(),
            niveau: 'L1',
            filiere: 'Informatique',
            heureDeb:'8h:00',
            heureFin:'12h00',
            status: 'RESERVE',
        };
        setReservations([...reservations, newEntry]);
        setHeureDeb('');
        setHeureFin('');
        setDate('');
    };

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS=='ios'?'padding':'height'}
      style={styles.container}
      >
        <Text onPress={()=>router.back()}  style={{fontSize:20,color:'#3b5bdb',marginBottom:10,fontWeight:'bold'}} >{"<---"} Retour</Text>
        <ScrollView >
            <View  >
                <Text style={styles.title}>{nom}—Réservations</Text>
                <FlatList
                    style={{height:450}}
                    data={reservations}
                    renderItem={({ item }) => (
                        <View style={{}}>
                            <View style={{width:500,height:2,backgroundColor:'black'}}></View>
                            <View style={styles.row}>
                            <Text style={styles.cell}>{item.niveau}</Text>
                            <Text style={styles.cell}>{item.filiere}</Text>
                            <View style={styles.ceelView}>
                                <Text >{item.heureDeb}</Text>
                                <Text >|</Text>
                                <Text >{item.heureFin}</Text>
                            </View>
                            <Text style={[styles.status, { backgroundColor: item.status === 'RESERVEE' ? 
                            '#3b5bdb' : 
                            item.status.toUpperCase()==='OCCUPEE'?"#F44336":
                            '#4CAF90' 
                            }]}>
                                {item.status}
                            </Text>
                        </View>
                
                        </View>
                        
                    )}
                    keyExtractor={(item) => item.id}
                />

                <TextInput
                    style={styles.input}
                    placeholder="heure de debut : hh:mm"
                    value={heureDeb}
                    onChangeText={setHeureDeb}
                />
                <TextInput
                    style={styles.input}
                    placeholder="heure de fin : hh:mm"
                    value={heureFin}
                    onChangeText={setHeureFin}
                />
                <TextInput
                    style={styles.input}
                    placeholder="jj/mm/aaaa"
                    value={date}
                    onChangeText={setDate}
                />
                <TouchableOpacity onPress={handleReserve} style={styles.button}>
                    <Text style={styles.buttonText}>Réserver</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 20,
        flex: 1,
        paddingTop:50,
        backgroundColor: '#fff'
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 5,
        padding:5,
        alignItems:'center',
    },
    cell: { 
        flex: 1, 

    },
    ceelView:{
        flex:1, 
        flexDirection:'column',
        gap:2,
        alignItems:'center'
    },
    status: { 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 5, 
        color: '#fff', 
        textAlign: 'center' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10, 
        marginVertical: 5, 
        borderRadius: 5 
    },
    button: { 
        backgroundColor: '#3b5bdb', 
        padding: 15, 
        borderRadius: 5, 
        marginTop: 10 
    },
    buttonText: { 
        color: '#fff', 
        textAlign: 'center', 
        fontWeight: 'bold' 
    },
});