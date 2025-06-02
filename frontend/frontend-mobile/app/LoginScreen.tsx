import { Link, router } from "expo-router";
import { useState } from "react";
import { View ,Text, TextInput, StyleSheet, TouchableOpacity, Image} from "react-native";
import { loginUser } from "./services/authService";



export default function LoginScreen(){
  const [username,setUserName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPasseWord]=useState('')
  const [message, setMessage]=useState('')
  const [useEmail,setUseEmail]=useState(false)

  const isValidUser = async () => {
    try {
      if (!email || !password) {
        setMessage("Aucun champ ne doit être vide");
        return;
      }
  
      const response = await loginUser({ email, password });
      // Redirection après succès
      router.push({
        pathname: "./(tabs)/HomePage",
        params: { user: response.username || username },
      });
    } catch (err: any) {
      setMessage(err); // Affiche l'erreur côté backend
    }
  };
  
  return(
    <View  style={Styles.vue}>
      <View style={{display:'flex',flexDirection:'row',gap:20}} >
        <Image style={{width:40,height:40}} source={require('@/assets/images/logo.png')} />
        <Text style={Styles.text}>RoomWise</Text>
      </View>
      <View>
        <Text style={{fontSize:20,margin:15}}>Connexion</Text>
      </View>
      <View >
      { !useEmail&&<TextInput value={username}  
        onChangeText={(val)=>{
          setUserName(val)
          setMessage('')
        }}
        style={Styles.textimput} placeholder="Nom d'utilisateur"/>}
        
        {useEmail&&<TextInput value={email}  
        onChangeText={(val)=>{
          setEmail(val)
          setMessage('')
        }}
        style={Styles.textimput} placeholder="Entrer Votre Adresse Mail"/>}
        <TextInput  
          value={password}
          onChangeText={(val)=>{
            setPasseWord(val)
            setMessage('')
          }} 
          secureTextEntry={true}
          style={Styles.textimput} placeholder="mot de passe"/>
        <Text style={Styles.text2}>*Mot de passe oublie?</Text>
        <Text style={Styles.text2} onPress={()=>setUseEmail(!useEmail)}>
          {!useEmail?"Utiliser l'adresse mail":"Utiliser le nom d'utilisaetur"}
        </Text>
      </View>
      <View >
      <TouchableOpacity onPress={isValidUser} style={Styles.connecter}>
          <Text  style={{color:'white'}}>Se Connecter</Text>
        </TouchableOpacity>
        <Text style={{color:'red', fontSize:15, textAlign:'center'}} >{message}</Text>
        <View style={{display:'flex', flexDirection:'row'}}>
          <Text style={{paddingLeft:20}}> {"vous n'avez pas de compte? "}</Text>
          <Link style={{color:'blue'}} href="/Inscription">
            <Text >S{"'"}inscrire</Text>
          </Link>
        </View>
      </View>
    </View>
  )
}


const Styles=StyleSheet.create({
  vue:{
    flex:1,
    backgroundColor:'white',
    paddingTop:40,
    alignItems:"center",
  },
  text:{
    color:'#14467a',
    fontSize:30,
    fontWeight:'bold',
    alignItems:'center',
    borderRadius:20,
  },
  text1:{
    marginTop:30,
    padding:30,
    alignItems:'center'
  },
  textimput:{
     height:50,
    width:300,
    borderStyle:"solid",
    borderColor:'black',
    color:'black',
    padding:10,
    margin:15,
    borderRadius:15,
    borderWidth:1,
    fontSize:20,
  },
  text2:{
    color:'#14467a',
    padding:1,
    marginLeft:180,
    textAlign:'right'
  },
  connecter:{
    justifyContent:'center',
    height:50,
    width:300,
    padding:10,
    color:'white',
    borderRadius:15,
    backgroundColor:'#14467a',
    alignItems:'center',
    margin:15,
    fontSize:20,
  },
  inscrire:{
    height:50,
    width:300,
    padding:10,
    color:'black',
    backgroundColor:'',
    marginTop:60,
    fontWeight:'bold',

  }



})