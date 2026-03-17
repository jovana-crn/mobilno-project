import React, {useState, useLayoutEffect} from "react";
import {View, Button, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/Styles';
import { useLanguage } from "@/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "@/screens/SettingsModal";

const TicTacToeImage = require('../assets/images/tic-tac-toe.png');
const MemoryGameImage = require('../assets/images/memory-game3.png');
const GameImage = require('../assets/images/2048.png');

const HomeScreen = ({navigation, route}) => {
    const { korisnik } = route.params;
    const { t } = useLanguage();
    const [settingsVisible, setSettingsVisible] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => setSettingsVisible(true)} style={{ marginRight: 15 }}>
                <Ionicons name="settings-outline" size={26} color="white" />
            </TouchableOpacity>
        ),
        });
    }, [navigation]);

    return(
        <View style={styles.homeContainer}>
            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                game=""
                transparent={true}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                <View style={{alignItems: 'flex-start', marginTop: 20, /* backgroundColor: '#d7d794ff', */ padding: 12, borderRadius: 15}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{t("leaderboard")}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate('TicTacToe', { korisnik })}>
                <View style={{alignItems: 'center'}}>
                    <Image source={ TicTacToeImage } style={styles.image}/>
                    <Text style={styles.imageText}>{t("tttGame")}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate('MemoryGame', { korisnik })}>
                <View style={{alignItems: 'center'}}>
                    <Image source={ MemoryGameImage } style={styles.image}/>
                    <Text style={styles.imageText}>{t("memoryGame")}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonGame} onPress={() => navigation.navigate('Game2048', { korisnik })}>
                <View style={{alignItems: 'center'}}>
                    {/* <Image source={ GameImage } style={styles.image}/> */}
                    <Text style={styles.buttonGameText}>2048</Text>
                    <Text style={styles.imageText}>2048</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;