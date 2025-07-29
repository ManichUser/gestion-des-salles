import  { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,ToastAndroid } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { StatiquePlanningResponse,days, reservationData, reservationRequestData, filterPlanningBySalle, filterBySalle, isHeureValide, isChevauchementHoraire, isChevauchementStatiqueHoraire, isSalleReserver, isDefaultOwner, filterPlanningByJour, isEcheanceStatiqueLibre, findProprietaireNiveaProprietairefiliereForHorraire } from '../data/reservationData';
import {  useLocalSearchParams } from 'expo-router';
import { createReservation, getReservations, getAllStatiquePlannings } from '../services/reservationService';
import { getAuthenticatedUser, getListDelegue, getUserIdsSameFiliereAndNiveau } from '../services/authService';
import { user, userExample } from '../data/userData';
import { Button } from 'react-native-paper';
import { CreateMessageNotificationForOtherDelegue, NotificationRequest, createNotification } from '../services/notificationService';

export default function ReservationScreen() {

    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [reservations, setReservations] = useState<reservationData[]>([]);
    const [statiquesPlanning, setStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [MonStatiquesPlanning, setMonStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [TueStatiquesPlanning, setTueStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [WenStatiquesPlanning, setWenStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [ThurStatiquesPlanning, setThurStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [FriStatiquesPlanning, setFriStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [SatStatiquesPlanning, setSatStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [SunStatiquesPlanning, setSunStatiquesPlanning] = useState<StatiquePlanningResponse[]>([]);
    const [heureDeb, setHeureDeb] = useState(new Date());
    const [heureFin, setHeureFin] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [showHeureDeb, setShowHeureDeb] = useState(false);
    const [showHeureFin, setShowHeureFin] = useState(false);
    const [showMon,setShowMon]=useState(false)
    const [showTues,setShowTues]=useState(false)
    const [showWen,setShowWen]=useState(false)
    const [showThur,setShowThur]=useState(false)
    const [showFrid,setShowFrid]=useState(false)
    const [showSat,setShowSat]=useState(false)
    const [showSun,setShowSun]=useState(false)
    const [coursPrevu, setCoursPrevu] = useState('');
    const [user, setUser] = useState<user>(userExample);

    const { id, nom } = useLocalSearchParams();



    const status: string = 'RESERVEE';
    const onChangeDate = (_: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDate(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const onChangeHeureDeb = (_: DateTimePickerEvent, selectedHeureDeb?: Date) => {
        setShowHeureDeb(Platform.OS === 'ios');
        if (selectedHeureDeb) setHeureDeb(selectedHeureDeb);
    };

    const onChangeHeureFin = (_: DateTimePickerEvent, selectedHeureFin?: Date) => {
        setShowHeureFin(Platform.OS === 'ios');
        if (selectedHeureFin) setHeureFin(selectedHeureFin);
    };

    useEffect(() => {
        const fetchStatic = async () => {
        
            try {
                const staticData = await getAllStatiquePlannings();
            
                const filtered = filterPlanningBySalle(id?.toString() , staticData);
        
                setStatiquesPlanning(filtered);

                setSunStatiquesPlanning(filterPlanningByJour(days[0],filtered))
                setMonStatiquesPlanning(filterPlanningByJour(days[1],filtered))
                setTueStatiquesPlanning(filterPlanningByJour(days[2],filtered))
                setWenStatiquesPlanning(filterPlanningByJour(days[3],filtered))
                setThurStatiquesPlanning(filterPlanningByJour(days[4],filtered))
                setFriStatiquesPlanning(filterPlanningByJour(days[5],filtered))
                setSatStatiquesPlanning(filterPlanningByJour(days[6],filtered))

            } catch (err) {
                console.log('Erreur chargement planning statique');
            }finally{
                setLoading(false)
            }
        };
        fetchStatic();
    }, [nom]);

    useEffect(() => {
        const fetchPlannings = async () => {
            try {
                const data: reservationData[] = await getReservations();
                const authenticatedUser: user = await getAuthenticatedUser(); 
                setUser(authenticatedUser);
                const filteredReservation=filterBySalle(nom.toString(),data)
                setReservations(filteredReservation);
            } catch (err) {
                console.log('Erreur lors de la recuperation des reservations', err);
            }finally{
                setLoading2(false)
            }
        }
        fetchPlannings()
    }, []);

    const handleReserve = async () => {
        console.log('debut reservation')
        const formattedDate = date.toISOString().split('T')[0];
        const formattedHeureDeb = heureDeb.toTimeString().substring(0, 5);
        const formattedHeureFin = heureFin.toTimeString().substring(0, 5);

        if (!isHeureValide(formattedHeureDeb,formattedHeureFin)) {
            Alert.alert("Attention","veuiller vous rassurer que l'heure de fin soit apres l'heure de debut")
            return
        }
        console.log('1')
        if(isChevauchementHoraire(formattedDate,formattedHeureDeb,formattedHeureFin,reservations)||
        isChevauchementStatiqueHoraire(formattedDate,formattedHeureDeb,formattedHeureFin,statiquesPlanning)){
            Alert.alert("Attention","Desoler mais vous chevauchez une plage horraire, veuillez chosir une autre")
            return
        }
        console.log('2')
        if(isSalleReserver(nom.toString(),formattedDate,formattedHeureDeb,formattedHeureFin,reservations)){
        
            ToastAndroid.show('Desoler cette salle a deja ete reservee elle',1000)
            return
        }
        console.log('3')
        const newEntry: reservationRequestData = {
            proprietaireNiveau: user.niveau,
            proprietaireFiliere: user.filiere,
            heureDebut: formattedHeureDeb,
            heureFin: formattedHeureFin,
            salleReserver: nom?.toString() || '', 
            date: formattedDate,
            coursPrevu: coursPrevu,
            delegueId: user.id?.toString() || '', 
        };
        console.log('4')
    
        // if(!isDefaultOwner(formattedDate,formattedHeureDeb,formattedHeureFin,user.filiere.toString(),user.niveau.toString(),statiquesPlanning)){
        //     const notif1:NotificationRequest={
        //         destinataireId: [user.id.toString()],
        //         titre: 'Notification',
        //         description: `PASSIF@Votre demande de reservation de la salle ${newEntry.salleReserver} pour le ${newEntry.date} de ${newEntry.heureDebut} à ${newEntry.heureFin} est en
        //         attente de reservation`,
        //         expediteurId:'system'
        //     }
        //     const message =CreateMessageNotificationForOtherDelegue('ACTIF',newEntry)
        //     const Delegues:user[]=await getListDelegue()
        //     const {filiere,niveau}=findProprietaireNiveaProprietairefiliereForHorraire(formattedDate,formattedHeureDeb,formattedHeureFin,statiquesPlanning)
        //     const delegue=Delegues.find(del=> del.filiere===filiere?.toString() && del.niveau===niveau)
        //     const delegueId:string=delegue?.id?.toString()||''
        //     const notif2:NotificationRequest={
        //         destinataireId: [delegueId],
        //         titre: 'Confirmation Reservation',
        //         description: message,
        //         expediteurId:user.id.toString()
        //     }
        //     console.log("creation notification 1")
        //     const notificationCreated=await createNotification(notif1)
        //     console.log('notification 1 creer', notificationCreated.titre)
        //     console.log("creation notification 2")
        //     const notificationCreated2=await createNotification(notif2)
        //     console.log('notification  2 creer', notificationCreated2.titre)
        //     ToastAndroid.show("Une notification vous attends à l'ecran des notifications",2000)
        //     return
        // }
        console.log('5')

        try {
            const reservationsCreated:reservationData = await createReservation(newEntry);
            
            Alert.alert(`Reservation de ${nom}`, `Votre reservation pour le ${reservationsCreated.date} a bien été enregistrée`);
            console.log("creation notification")
            const ids = await getUserIdsSameFiliereAndNiveau(user.id);
            const notification :NotificationRequest={
                destinataireId: ids.map((id)=>id.toString()),
                titre: 'Important',
                description: `PASSIF@Reservation de la ${newEntry.salleReserver} pour motif : ${newEntry.coursPrevu}
                                le ${newEntry.date} de ${newEntry.heureDebut} à ${newEntry.heureFin}`,
                expediteurId:user.id.toString()
            }
            console.log("creation notification")
            const notificationCreated=await createNotification(notification)
            console.log('notification creer', notificationCreated.titre)
            
        
            setReservations(prevReservations => [...prevReservations, reservationsCreated]);
        } catch (error) {
            console.error("Erreur lors de la création de la réservation :", error);
            Alert.alert("Erreur", "Impossible de créer la réservation. Veuillez réessayer.");
        }
    };

    const renderReservationOrPlanningItem = ({ item }: { item: reservationData | StatiquePlanningResponse }) => (
        <View>
            {/* Note: La largeur de 500px pour la ligne noire n'est pas réactive. Utilisez '100%' ou un style plus flexible. */}
            <View style={{ width: '100%', height: 2, backgroundColor: 'black' }} />
            <View style={styles.row}>
                <Text style={styles.cell}>{'proprietaireNiveau' in item ? item.proprietaireNiveau : ''}</Text>
                <View style={styles.ceelView}>
                    <Text style={styles.cell}>{'proprietaireFiliere' in item ? item.proprietaireFiliere : ''}</Text>
                    <Text>le</Text>
                    <Text style={styles.cell}>{'date' in item ? item.date : ''}</Text>
                </View>
                <View style={styles.ceelView}>
                    <Text>{item.heureDebut?.substring(0, 5) || ''}</Text> 
                    <Text>à</Text>
                    <Text>{item.heureFin?.substring(0, 5) || ''}</Text> 
                </View>
                <Text style={[styles.status, {
                    backgroundColor:
                        status === 'RESERVEE' ? '#3b5bdb' : 
                            status.toUpperCase() === 'OCCUPEE' ? '#F44336' :
                                '#4CAF90',
                }]}> {status} </Text>
            </View>
        </View>
    );
    const renderItemPlanning=({item,index}:{item:reservationData|StatiquePlanningResponse,index:number})=>(
        <View key={item.id?.toString() || index.toString()}>
                                    <View style={{ width: '100%', height: 2, backgroundColor: 'black' }} />
                                    <View style={styles.row}>
                                        <View style={styles.ceelView}>
                                            <Text>{item.proprietaireFiliere}</Text>
                                            <Text>{item.proprietaireNiveau}</Text>
                                            <Text>{item.coursPrevu}</Text>
                                        </View>
                                        <View style={styles.ceelView}>
                                            <Text>{item.heureDebut}</Text>
                                            <Text>à</Text>
                                            <Text>{item.heureFin}</Text>
                                        </View>
                                        <Text style={[styles.status, { backgroundColor: '#4CAF90' }]}>LIBRE</Text>
                                    </View>
                                </View>
    )


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        { loading? (
            <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
        ):( <FlatList
                data={reservations} 
                renderItem={renderReservationOrPlanningItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()} 
                ListHeaderComponent={() => (
                    <View>
                        <Text style={styles.title}>Programme Hebdomadaire</Text>
                
                        {loading2 ? (
                            <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
                        ) : (statiquesPlanning.length === 0 )? (
                            <Text style={{ color: 'red' }}>Pas de planning pour cette salle</Text>
                        ) : (
                        <ScrollView>
                            <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowMon(!showMon)}>
                                <Text style={styles.buttonText}>Lundi</Text>
                            </TouchableOpacity>
                        {showMon &&(
                            <View>
                                {   MonStatiquesPlanning.length===0?
                                (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                            ) :(
                                    MonStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                                )}
                            </View>
                            )}
                            </View>
                        <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowTues(!showTues)}>
                                <Text style={styles.buttonText}>Mardi</Text>
                            </TouchableOpacity>
                        {showTues &&(
                            <View>
                            {   TueStatiquesPlanning.length===0?
                            (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                            ) :(
                                TueStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                            )}
                            </View>
                            )}
                        </View>
                        <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowWen(!showWen) }>
                                <Text style={styles.buttonText}>Mercredi</Text>
                            </TouchableOpacity>
                        {showWen &&(
                            <View>
                            {   WenStatiquesPlanning.length===0?
                            (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                            ) :(
                                WenStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                            )}
                            </View>
                            )}
                        </View>
                        <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowThur(!showThur) }>
                                <Text style={styles.buttonText}>Jeudi</Text>
                            </TouchableOpacity>
                        {showWen &&(
                                <View>
                                {   ThurStatiquesPlanning.length===0?
                                (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                                ) :(
                                    ThurStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                                )}
                                </View>
                            )}
                        </View>
                        <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowFrid(!showFrid) }>
                                <Text style={styles.buttonText}>Vendredi</Text>
                            </TouchableOpacity>
                        {showWen &&(
                            <View>
                            {   FriStatiquesPlanning.length===0?
                            (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                            ) :(
                                FriStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                            )}
                            </View>
                            )}
                        </View>
                        <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowSat(!showSat) }>
                                <Text style={styles.buttonText}>Samedi</Text>
                            </TouchableOpacity>
                        {showWen &&(
                            <View>
                            {   SatStatiquesPlanning.length===0?
                            (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                            ) :(
                                SatStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                            )}
                            </View>
                            )}
                        </View>
                        <View>
                            <TouchableOpacity style={[styles.button,{marginBottom:10}]} onPress={()=>setShowSun(!showSun) }>
                                <Text style={styles.buttonText}>Dimanche</Text>
                            </TouchableOpacity>
                        {showWen &&(
                                <View>
                                {   SunStatiquesPlanning.length===0?
                                (<Text  style={{ color: 'red' }} >Cette Journee ne possede pas encore de plannification</Text>
                                ) :(
                                    SunStatiquesPlanning.map((item, index) => (renderItemPlanning({item,index})))
                                )}
                                </View>
                            )}
                        </View>
                        </ScrollView>
                        
                        
                            
                        )}
                
                        <Text style={styles.title}>{nom} — Réservations</Text>
                    </View>
                )}
                

                // Contenu affiché APRÈS la liste des réservations
                ListFooterComponent={() => (
                    <ScrollView>
                        {user.roleName === 'DELEGUE' && (
                            <View style={{paddingBottom:70}}>
                                <Text style={styles.title}>Créer Votre Réservation :</Text>

                            
                                    <Button style={styles.button} onPress={() => setShowDate(true)}><Text style={styles.buttonText}>Choisir une date</Text></Button>
                                    <Text style={styles.input}>Date: {date.toDateString()}</Text>
                            

                                
                                    <Button style={styles.button} onPress={() => setShowHeureDeb(true)}><Text style={styles.buttonText}>Heure de début</Text></Button>
                                    <Text style={styles.input}>Début: {heureDeb.toTimeString().substring(0, 5)}</Text>
                                

                            
                                    <Button style={styles.button} onPress={() => setShowHeureFin(true)}><Text style={styles.buttonText}>Heure de fin</Text></Button>
                                    <Text style={styles.input}>Fin: {heureFin.toTimeString().substring(0, 5)}</Text>
                            

                                {showDate && (<DateTimePicker value={date} mode='date' display='default' onChange={onChangeDate} />)}
                                {showHeureDeb && (<DateTimePicker value={heureDeb} mode='time' display='default' is24Hour={true} onChange={onChangeHeureDeb} />)}
                                {showHeureFin && (<DateTimePicker value={heureFin} mode='time' display='default' is24Hour={true} onChange={onChangeHeureFin} />)}

                                <TextInput style={styles.input} placeholder="Motif" value={coursPrevu} onChangeText={setCoursPrevu} />

                                <TouchableOpacity onPress={handleReserve} style={[styles.button]}>
                                    <Text style={styles.buttonText}>Réserver</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                )}
            />)}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        padding: 5,
        alignItems: 'center',
    },
    cell: {
        flex: 1,
    },
    ceelView: {
        flex: 1,
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
    },
    status: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        color: '#fff',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        fontSize: 15,
    },
    button: {
        backgroundColor: '#3b5bdb',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',

    },
});