import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RoomsListScreen from '../screens/RoomsListScreen';
export default function App() {
  return (
    <View style={styles.container}>
    <Text style={styles.sectionTitle}>Liste des salles de classe</Text>

      <RoomsListScreen /> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 15
  },
  sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 10,
      }
});