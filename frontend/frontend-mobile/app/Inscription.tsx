import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Provider, Menu, Button } from "react-native-paper";
import { registerUser } from "./services/authService";

export default function Inscription() {
  const Filiere = [
    "Informatique", "Mathématique", "Chimie", "Physique",
    "Biochimie", "Biologie Animale", "Biologie Végétale", "Sciences de la Terre"
  ];

  const [step, setStep] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState({
    lastname: '',
    firstname: '',
    username: '',
    email: '',
    password: '',
    filiere: '',
    niveau: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleRegister = async () => {
    const niveauNum = parseInt(user.niveau);
    if (niveauNum >= 1 && niveauNum <= 5) {
      try {
        await registerUser(user);
        Alert.alert("Succès", "Inscription réussie !");
        router.push('/LoginScreen');
      } catch (error) {
        Alert.alert("Erreur", "L'inscription a échoué.");
      }
    } else {
      Alert.alert("Erreur", "Le niveau doit être entre 1 et 5.");
    }
  };
  

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo} source={require('@/assets/images/logo.png')} />
          <Text style={styles.title}>RoomWise</Text>
        </View>

        <Text style={styles.stepTitle}>Inscription {"( "}Étape {step} sur 3 {" )"}</Text>

        {step === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={user.lastname}
              onChangeText={text => setUser({ ...user, lastname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={user.firstname}
              onChangeText={text => setUser({ ...user, firstname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              value={user.username}
              onChangeText={text => setUser({ ...user, username: text })}
            />
          </>
        )}

        {step === 2 && (
          <>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.menuButton}
              >
                {user.filiere || "Sélectionner votre filière"}
              </Button>
            }>
            {Filiere.map((filiere, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setUser({ ...user, filiere });
                  setMenuVisible(false);
                }}
                title={filiere}
              />
            ))}
          </Menu>

          <TextInput
            style={styles.input}
            placeholder="Niveau (1 à 5)"
            keyboardType="numeric"
            value={user.niveau}
            onChangeText={text => setUser({ ...user, niveau: text })}
          />
        </>
        )}

        {step === 3 && (
          <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={user.email}
            onChangeText={text => setUser({ ...user, email: text })}
          />
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Mot de passe"
            value={user.password}
            onChangeText={text => setUser({ ...user, password: text })}
            
          />
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Confirmer le Mot de passe"
            value={user.password}
            onChangeText={text => setUser({ ...user, password: text })}
            
          />
        </>
        )}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
              <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
          )}
          {step < 3 ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text>Vous avez déjà un compte ?</Text>
          <Link href="/LoginScreen"><Text style={{ color: 'blue' }}> Se connecter</Text></Link>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14467a',
  },
  stepTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  menuButton: {
    marginVertical: 10,
    width: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#14467a',
    padding: 12,
    borderRadius: 12,
    width: 120,
    alignItems: 'center',
  },
  secondaryButton: {
    // backgroundColor: '#ccc',
    backgroundColor: '#14467a',
    padding: 12,
    borderRadius: 12,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
