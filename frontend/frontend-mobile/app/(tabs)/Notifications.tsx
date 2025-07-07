import React from "react";
import { View,Text,StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Notification, changeStatus, consulter, sampleNotifData } from "../data/NotificationUserData";
import { userExample } from "../data/userData";
import { router } from "expo-router";

export default function NotificationsScreen(){
    const handleChangeStatus=(idNotif:string,idUser:string)=>{
    const notification=sampleNotifData.find((notif)=>notif.id===idNotif)
    const statusNotifForUser=notification?.statusNotification.find((statut)=>statut.idUser===idUser)
    const indexNotif=sampleNotifData.findIndex((notif)=>notif.id===notification?.id)
    const indexNotifUser=notification?.statusNotification.findIndex((notifStatus)=>notifStatus.idUser===statusNotifForUser?.idUser)||0
    changeStatus(indexNotif,indexNotifUser)
    router.push({pathname:`../notification/${idNotif}`})
    }
    const data =sampleNotifData
    const renderItem=({item}:{item:Notification})=>(
        <TouchableOpacity onPress={()=>{
            consulter(item.id,userExample.id.toString())?
            handleChangeStatus(item.id,userExample.id.toString()):
            router.push({pathname:`../notification/${item.id}`,params:{id:item.id,title:item.title}})
        }} >
            <View style={styles.notification}>
                <View style={styles.Title}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                { !consulter(item.id,userExample.id.toString())&&(<View style={styles.statusNotif}/>)}
                </View>
                <Text style={styles.notificationDesc} >{item.description}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container} >
            <Text style={styles.header}>Vos Notifications</Text>
            <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item)=>item.id}
            />
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        padding:16,
        paddingTop:40
    },
    header:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:16
    },
    notification:{
        marginBottom:16
    },
    notificationTitle:{
        fontSize:18,
        fontWeight:'bold',
        marginBottom:4,
        color:'#0959e4'
    },
    Title:{
        display:'flex',
        flexDirection:'row',
        gap:5
    
    },
    notificationDesc:{
        width:'auto',
        height:20,
        paddingLeft:5
    },
    notificationText:{
        fontSize:16
    },
    statusNotif:{
        width:10,
        height:10,
        borderRadius:100,
        backgroundColor:'#4CAF'
    }
})