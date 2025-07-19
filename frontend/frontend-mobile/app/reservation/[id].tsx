
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView, ScrollView,Platform, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import {  StatiquePlanningResponse, reservationData, reservationRequestData ,filterPlanningBySalle} from '../data/reservationData';
import { router, useLocalSearchParams } from 'expo-router';
import { createReservation, getReservations,getAllStatiquePlannings } from '../services/reservationService';

import { getAuthenticatedUser } from '../services/authService';
import { user, userExample } from '../data/userData';
import { Button } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';


export default function ReservationScreen() {
    const [reservations, setReservations] = useState<reservationData[]>([]);
    const [statiquesPlanning,setStatiquesPlanning]=useState<StatiquePlanningResponse[]>([])

    const status:string="RESERVEE"

    const [heureDeb, setHeureDeb] = useState(new Date);
    const [heureFin, setHeureFin] = useState(new Date);
    const [date, setDate] = useState(new Date());
    const [showDate,setShowDate]=useState(false)
    const [showHeureDeb,setShowHeureDeb]=useState(false)
    const [showHeureFin,setShowHeureFin]=useState(false)
    const [coursPrevu, setCoursPrevu] = useState('');
    const [user,setUser]=useState<user>(userExample)
    const {id,nom}=useLocalSearchParams()

    const onChangeDate=(_: DateTimePickerEvent,selectedDate?:Date)=>{
        setShowDate(Platform.OS==="ios")
        if (selectedDate) setDate(selectedDate)
    }
    const onChangeHeureDeb=(_:  DateTimePickerEvent,selectedHeureDeb?:Date)=>{
        setShowHeureDeb(Platform.OS==="ios")
        if (selectedHeureDeb) setHeureDeb(selectedHeureDeb)
    }
    const onChangeHeureFin=(_:  DateTimePickerEvent,selectedHeureFin?:Date)=>{
        setShowHeureFin(Platform.OS==="ios")
        if (selectedHeureFin) setHeureFin(selectedHeureFin)
    }

    useEffect(() => {
        const fetchStatic = async () => {
          try {
            const staticData = await getAllStatiquePlannings();
            const filtered = filterPlanningBySalle(nom.toString(), staticData);
            setStatiquesPlanning(filtered);
          } catch (err) {
            console.log("Erreur chargement planning statique", err);
          }
        };
        fetchStatic();
      }, [nom]);
      

    useEffect(()=>{
        const fetchPlannings= async()=>{
            try{
                const data : reservationData[]= await getReservations()
                const user:user=await getAuthenticatedUser()
                setUser(user)
                setReservations(data)
            }catch(err){
                console.log("Erreur lors de la recuperation des reservations",err)
            }
        }
        fetchPlannings()
    },[])
    const handleReserve = async () => {
        
        const formattedDate=date.toISOString().split('T')[0];
        const formattedHeureDeb=heureDeb.toTimeString().substring(0,5);
        const formattedHeureFin=heureFin.toTimeString().substring(0,5)

        console.log("Date, heure",formattedDate,formattedHeureDeb)



        const newEntry:reservationRequestData = {
            proprietaireNiveau: user.niveau,
            proprietaireFiliere: user.filiere,
            heureDebut:formattedHeureDeb,
            heureFin: formattedHeureFin,
            salleReserver: nom.toString(),
            date: formattedDate,
            coursPrevu: coursPrevu,
            delegueId: user.id.toString()
        };
        const reservationsCreated=await createReservation(newEntry)
        Alert.alert(`Reservation de ${nom}`, `Votre reservation pour le ${reservationsCreated.date} a bien été enregistrée` )
    
    };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS=='ios'?'padding':'height'}
        style={styles.container}
        >
        <Text onPress={()=>router.back()}  style={{fontSize:20,color:'#3b5bdb',marginBottom:10,fontWeight:'bold'}} >{"<---"} Retour</Text>
        <ScrollView>
                <Text style={styles.title}>{nom}—Réservations</Text>
                <View>
                <FlatList
                    style={{height:400}}
                    data={reservations}
                    renderItem={({ item }) => (
                        <View style={{}}>
                            <View style={{width:500,height:2,backgroundColor:'black'}}></View>
                            <View style={styles.row}>
                            <Text style={styles.cell}>{item.proprietaireNiveau}</Text>
                            <View style={styles.ceelView}>
                                <Text style={styles.cell}>{item.proprietaireFiliere}</Text>
                                <Text >le</Text>
                                <Text style={styles.cell}>{item.date}</Text>
                            </View>
                            <View style={styles.ceelView}>
                                <Text >{item.heureDebut.substring(0,5)}</Text>
                                <Text >à</Text>
                                <Text >{item.heureFin.substring(0,5)}</Text>
                            </View>
                            <Text style={[styles.status, { backgroundColor: status === 'RESERVEE' ? 
                            '#3b5bdb' : 
                            status.toUpperCase()==='OCCUPEE'?"#F44336":
                            '#4CAF90' 
                            }]}>
                                {status}
                            </Text>
                        </View>
                
                        </View>
                        
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
                <FlatList
                    style={{height:400}}
                    data={reservations}
                    renderItem={({ item }) => (
                        <View style={{}}>
                            <View style={{width:500,height:2,backgroundColor:'black'}}></View>
                            <View style={styles.row}>
                            <Text style={styles.cell}>{item.proprietaireNiveau}</Text>
                            <View style={styles.ceelView}>
                                <Text style={styles.cell}>{item.proprietaireFiliere}</Text>
                                <Text >le</Text>
                                <Text style={styles.cell}>{item.date}</Text>
                            </View>
                            <View style={styles.ceelView}>
                                <Text >{item.heureDebut.substring(0,5)}</Text>
                                <Text >à</Text>
                                <Text >{item.heureFin.substring(0,5)}</Text>
                            </View>
                            <Text style={[styles.status, { backgroundColor: status === 'RESERVEE' ? 
                            '#3b5bdb' : 
                            status.toUpperCase()==='OCCUPEE'?"#F44336":
                            '#4CAF90' 
                            }]}>
                                {status}
                            </Text>
                        </View>
                
                        </View>
                        
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />

                </View>

            { user.roleName==='DELEGUE'&&(<View>
                    <Text style={styles.title}>Creer Votre Reservation :</Text>
                    <View style={styles.row}>
                        <Button style={styles.button} children={<Text style={styles.buttonText} >Choisir une date</Text>}  onPress={()=>setShowDate(true)} />
                        <Text style={styles.input}>Date:{" "+date.toDateString()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Button style={styles.button} children={<Text style={styles.buttonText}>Choisir l'heure de debut</Text>}  onPress={()=>setShowHeureDeb(true)} />
                        <Text style={styles.input}>Heure de debut: {" "+heureDeb.toTimeString().substring(0,5)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Button style={styles.button} children={<Text style={styles.buttonText}>Choisir l'heure de fin</Text>}  onPress={()=>setShowHeureFin(true)} />
                        <Text style={styles.input}>Heure de debut: {" "+heureFin.toTimeString().substring(0,5)}</Text>
                    </View>
                    {showDate &&(
                        <DateTimePicker value={date} 
                        mode='date' 
                        display='default' 
                        onChange={onChangeDate} />)
                    }
                    {showHeureDeb &&(
                        <DateTimePicker 
                        value={heureDeb}
                        mode='time'  
                        display='default' 
                        is24Hour={true}
                        onChange={onChangeHeureDeb} />)
                    }
                    {showHeureFin &&(
                        <DateTimePicker 
                        value={heureFin} 
                        mode='time' 
                        is24Hour={true}
                        display='default' 
                        onChange={onChangeHeureFin} />)
                    }
                <TextInput
                    style={styles.input}
                    placeholder="Motif"
                    value={coursPrevu}
                    onChangeText={setCoursPrevu}
                />
                <TouchableOpacity onPress={handleReserve} style={styles.button}>
                    <Text style={styles.buttonText}>Réserver</Text>
                </TouchableOpacity>
            </View>)}

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
        borderRadius: 5, 
        fontSize:15
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