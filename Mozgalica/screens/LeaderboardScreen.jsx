import React, {useEffect, useState, useLayoutEffect} from 'react';
import { dohvatiRezultate, dohvatiRezultateFiltrirano } from '../db/database';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
//import { Picker } from 'react-native-picker/picker';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '@/context/LanguageContext';
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "@/screens/SettingsModal";

const LeaderboardScreen = ({navigation, route}) => {
    const [rezultati, setRezultati] = useState([]);
    const [filter, setFilter] = useState('');
    const [kriterijum, setKriterijum] = useState('korisnik');
    const [settingsVisible, setSettingsVisible] = useState(false);
    const { t } = useLanguage();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => setSettingsVisible(true)} style={{ marginRight: 15 }}>
                <Ionicons name="settings-outline" size={26} color="white" />
            </TouchableOpacity>
        ),
        });
    }, [navigation]);

    const ucitajPodatke = async () => {
        const data = await dohvatiRezultate();
        //console.log(data);
        setRezultati(data);
    };

    const ucitajFiltrirano = async (krit, tekst) => {
        const data = await dohvatiRezultateFiltrirano(krit, tekst);
        console.log(data);
        setRezultati(data);
    };

    /* useEffect(() => {
        ucitajPodatke();
    }, []); */

    /* useEffect(() => {
        (async () => {
            const svi = await dohvatiRezultate();
            console.log("DEBUG svi rezultati:", svi);
            setRezultati(svi);
        })();
    }, []); */

    useEffect(() => {
        if (filter.trim() === '') {
            ucitajPodatke(); // Vrati sve
        } else {
            ucitajFiltrirano(kriterijum, filter);
        }
    }, [filter, kriterijum]);

    /* useEffect(() => {
        ucitajFiltrirano(kriterijum, filter);
        //console.log(filter, kriterijum);
    }, [filter, kriterijum]); */

    /* const filtrirani = rezultati.filter((item) => {
        if(!filter) return true;
        const value = item[kriterijum]?.toString().toLowerCase();
        return value?.includes(filter.toLowerCase());
    }); */

    const renderItem = ({ item, index }) => (
        <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.name}>{item.korisnik}</Text>
            <Text style={styles.game}>{item.igra}</Text>
            <Text style={styles.score}>{item.poeni}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("leaderboard1")}</Text>

            <Text style={styles.filterLabel}>{t("search")}</Text>
            <View style={styles.filterRow}>
                <Picker
                    selectedValue={kriterijum}
                    style={styles.picker}
                    onValueChange={(value) => setKriterijum(value)}
                >
                    <Picker.Item label={t("user1")} value="korisnik" />
                    <Picker.Item label={t("game")} value="igra" />
                    <Picker.Item label={t("score")} value="poeni" />
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder={`Filtriraj po ${kriterijum}...`}
                    value={filter}
                    onChangeText={setFilter}
                />
            </View>

            <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.header]}>#</Text>
                <Text style={[styles.cell, styles.header]}>{t("user1")}</Text>
                <Text style={[styles.cell, styles.header]}>{t("game")}</Text>
                <Text style={[styles.cell, styles.header]}>{t("score")}</Text>
            </View>

            <FlatList
                data={rezultati}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                game=""
                transparent={true}
            />
    </View>
    );

};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: 40, 
        backgroundColor: '#ffffd4' 
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 20 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    headerRow: {
        borderBottomWidth: 2,
    },
    rank: { 
        fontWeight: 'bold', 
        width: 30 
    },
    name: { 
        flex: 1, 
        fontSize: 16
    },
    game: { 
        width: 100, 
        textAlign: 'center' 
    },
    score: { 
        width: 60, 
        textAlign: 'right', 
        fontWeight: 'bold' 
    },
    header: { 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    headerKorisnik: {  },
    cell: { },
    filterLabel: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 10
    },
    picker: {
        height: 70,
        flex: 0.4
    },
    input: {
        flex: 0.6,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        height: 40,
        borderRadius: 5
    }
});

export default LeaderboardScreen;