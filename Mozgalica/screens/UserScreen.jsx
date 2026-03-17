import React, { useState, useLayoutEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { styles } from '../styles/Styles';
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "@/screens/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";

const UserScreen = ({ navigation }) => {
    const [ime, setIme] = useState('');
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

    const potvrdi = () => {
        if(ime.trim().length > 0){
            navigation.navigate('Home', {korisnik: ime});
        }
    };

    return (
        <View style={styles.container}>

            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                game=""
                transparent={true}
            />
            <Text style={styles.title}>{t("user")}</Text>
            <TextInput 
                value={ime}
                onChangeText={setIme}
                style={styles.textInput}
            />
            <TouchableOpacity style={styles.button} onPress={potvrdi}>
                <Text style={styles.buttonText}>{t("continue")}</Text>
            </TouchableOpacity>
            {/* <Button title="Nastavi" onPress={potvrdi} /> */}
        </View>
    );
}

export default UserScreen;