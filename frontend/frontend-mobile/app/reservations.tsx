import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialData = [
    { id: '1', name: 'Emilie', filiere: 'Informatique', time: '09:00-10:00', status: 'Réservé' },
    { id: '2', name: 'Marc', filiere: 'Lettres', time: '11:30-12:30', status: 'Réservé' },
    { id: '3', name: 'Paul', filiere: 'Economie', time: '14:00-15:00', status: 'Libre' },
    { id: '4', name: 'Ali Keita', filiere: 'Economie', time: '14:00-16:00', status: 'En attente' },
];

export default function ReservationScreen() {
    const { salleName } = useLocalSearchParams();
    const [reservations, setReservations] = useState(initialData);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    const validateForm = () => {
        const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d\s*-\s*([0-1]\d|2[0-3]):[0-5]\d$/;
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!timeRegex.test(time)) {
            alert("Format de l'heure invalide. Exemple : 09:00 - 10:00");
            return false;
        }

        if (!dateRegex.test(date)) {
            alert("Format de la date invalide. Exemple : 01/01/2025");
            return false;
        }

        return true;
    };

    const handleReserve = () => {
        if (!validateForm()) return;
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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{salleName} — Réservations</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Planning du jour</Text>

                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, { flex: 3 }]}>Utilisateur</Text>
                    <Text style={[styles.headerCell, { flex: 3 }]}>Filiere</Text>
                    <Text style={[styles.headerCell, { flex: 3 }]}>Horaire</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Statut</Text>
                </View>
                <FlatList
                    data={reservations}
                    scrollEnabled={false} // important
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
                />
            </View>
            <View style={[styles.card]}>
                <Text style={styles.sectionTitle}>Effectuer une réservation</Text>
                <Text style={styles.label}>Horaire</Text>
                <TextInput
                    style={styles.input}
                    placeholder="hh:mm – hh:mm"
                    value={time}
                    onChangeText={setTime}
                />
                <Text style={styles.label}>Jour</Text>
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
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', marginBottom: 40 },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
        paddingHorizontal: 12
    },
    cell: { flex: 3, textAlign: 'center', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    status: { flex: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, color: '#fff', textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 },
    button: { backgroundColor: '#3b5bdb', padding: 15, borderRadius: 5, marginTop: 10 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    card: {
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 10,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontWeight: '600',
        fontSize: 14,
        color: '#333',
    }
});