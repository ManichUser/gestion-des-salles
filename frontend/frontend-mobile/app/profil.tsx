import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text,StyleSheet} from "react-native";
import { getAuthenticatedUser } from "./services/authService";
import { user } from "./data/userData";
import { Link } from "expo-router";


export default function ProfilScreen() {
    const [user,setUser]=useState<user>()
    useEffect(()=>{
        const fetchUser= async ()=>{
            try{
                const data = await getAuthenticatedUser()
            setUser( data)
            }catch(err){
                console.log(err)
            }
        }
        fetchUser()
    },[])
  return (
    <View style={{padding:20,backgroundColor:'white',flex:1,gap:10 }}>

        <View style={Styles.line} >
            <View>
            <Ionicons name='person' size={40} />
            </View>
            <View>
                <Text style={Styles.textTitle}>Nom et prenom :</Text>
                <Text id="inputNom">{user?.lastname + " " + user?.firstname}</Text>
            </View>
        </View>

        <View style={Styles.line} >
            <View>
                <Ionicons name='mail' size={40} />
            </View>
            <View>
                <Text style={Styles.textTitle}>Email : </Text>
                <Text > {user?.email}</Text>
            </View>
        </View>

        <View style={Styles.line}>
                <Text style={Styles.textTitle}>Filiere :</Text>
                <Text >{user?.filiere}</Text>
        </View>
            <View style={Styles.line}>
                <Text style={Styles.textTitle}>Niveau :</Text>
                <Text >{user?.niveau}</Text>
            </View>

            <Link href="/Login" style={{color:'#F55F1F', fontWeight:'500', fontSize:16, margin:150}}>Sign Out</Link>
        
        </View>
);
}


const Styles = StyleSheet.create({

    line:{
    width:'100%',
    display:'flex', 
    flexDirection:'row', 
    alignItems:'center',
    gap:15

    },
    textTitle:{
        fontSize:20,
        fontWeight:'bold'
    }
    
})



