import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialData = [
    { id: '1', name: 'Emilie', filiere: 'Informatique', time: '09:00–10:00', status: 'Réservé' },
    { id: '2', name: 'Marc', filiere: 'Lettres', time: '11:30–12:30', status: 'Réservé' },
    { id: '3', name: 'Paul', filiere: 'Economie', time: '14:00–15:00', status: 'Libre  ' },
    { id: '4', name: 'Ali Keita', filiere: 'Economie', time: '14:00–16:00', status: 'En attente' },
];

export default function ReservationScreen() {
    const [reservations, setReservations] = useState(initialData);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    const handleReserve = () => {
        const newEntry = {
            id: (reservations.length + 1).toString(),
            name: 'Ma réservation',
            filiere: 'Informatique',
            time,
            status: 'Réservé',
        };
        setReservations([...reservations, newEntry]);
        setTime('');
        setDate('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Salle A — Réservations</Text>
            <FlatList
                data={reservations}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.filiere}</Text>
                        <Text style={styles.cell}>{item.time}</Text>
                        <Text style={[styles.status, { backgroundColor: item.status === 'Réservé' ? '#3b5bdb' : '#ccc' }]}>
                            {item.status}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <TextInput
                style={styles.input}
                placeholder="heure de debut : hh:mm"
                value={time}
                onChangeText={setTime}
            />
            <TextInput
                style={styles.input}
                placeholder="heure de fin : hh:mm"
                value={time}
                onChangeText={setTime}
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
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1,paddingTop:50, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
    cell: { flex: 1 },
    status: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, color: '#fff', textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 },
    button: { backgroundColor: '#3b5bdb', padding: 15, borderRadius: 5, marginTop: 10 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});