import { useLocalSearchParams } from "expo-router";
import { View,Text, TouchableOpacity,StyleSheet } from "react-native";
import { sampleNotifData } from "../data/NotificationUserData";


export default function NotificationScreen(){
    const {id,title}=useLocalSearchParams();
    const notification=sampleNotifData.find((notif)=>notif.id===id)
    const isActif=notification?.type==='ACTIF'


    return (
        <View style={styles.container}>
            {isActif?(
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.desc}>{notification?.description}</Text>
                    <View style={styles.containerButton}>
                    <TouchableOpacity style={styles.refuser }>
                            <Text style={styles.buttonText}>Refuser</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accepter }>
                            <Text style={styles.buttonText}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ):
            <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.desc}>{notification?.description}</Text>
            </View>
            }
        </View>
    )
}

const styles =StyleSheet.create({

    container: {
        flex:1,
        backgroundColor:'white',
        paddingTop:70,
        paddingHorizontal:10
    },
    title: {
        textAlign:'center',
        fontSize:30,
        color:'#0959e4',
        fontWeight:'bold',
        marginBottom:10,
    },
    desc: {
        fontSize:20,
        fontWeight:'500'
    },
    containerButton: {
        flexDirection:'row',
        gap:15,
        marginTop:15
    },
    accepter:{
        borderRadius: 10,
        alignItems: 'center',
        padding:10,
        backgroundColor: '#2563eb',
    },
    refuser:{
        borderRadius: 10,
        alignItems: 'center',
        padding:10,
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
})