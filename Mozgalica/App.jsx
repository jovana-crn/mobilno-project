import React, { useEffect} from 'react';
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { initDB } from './db/database';
import UserScreen from './screens/UserScreen';
import HomeScreen from './screens/HomeScreen';
import TicTacToe from './screens/TicTacToeScreen';
import MemoryGame from './screens/MemoryGameScreen';
import Game2048 from './screens/2048Screen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { styles } from './styles/Styles';

const Stack = createNativeStackNavigator();

export default function App(){
    useEffect(() => {
        initDB();
        
    }, []);

    return (
        <LanguageProvider>
            <AppNavigator></AppNavigator>
        </LanguageProvider>
    );
}

function AppNavigator() {
    const { t } = useLanguage();

    return(
        <NavigationContainer>
                <Stack.Navigator initialRouteName='User'>
                    <Stack.Screen 
                        name="User" 
                        component={UserScreen} 
                        options={{ 
                            title: t("welcome"), 
                            headerStyle: styles.headerStyle, 
                            headerTitleStyle: styles.headerTitleStyle
                        }} 
                    />
                    <Stack.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{ 
                            title: 'Mozgalica', 
                            headerStyle: styles.headerStyle, 
                            headerTitleStyle: styles.headerTitleStyle, 
                            headerTintColor: styles.headerTintColor
                        }} 
                    />
                    <Stack.Screen 
                        name="TicTacToe" 
                        component={TicTacToe} 
                        options={{ 
                            title: t("tttGame"), 
                            headerStyle: styles.headerTTTStyle, 
                            headerTitleStyle: styles.headerTitleStyle, 
                            headerTintColor: styles.headerTintColor
                        }} 
                    />
                    <Stack.Screen 
                        name="MemoryGame" 
                        component={MemoryGame} 
                        options={{ 
                            title: t("memoryGame"), 
                            headerStyle: styles.headerStyle, 
                            headerTitleStyle: styles.headerTitleStyle, 
                            headerTintColor: styles.headerTintColor
                        }} 
                    />
                    <Stack.Screen 
                        name="Game2048" 
                        component={Game2048} 
                        options={{ 
                            title: '2048', 
                            headerStyle: styles.headerStyle, 
                            headerTitleStyle: styles.headerTitleStyle, 
                            headerTintColor: styles.headerTintColor
                        }} 
                    />
                    <Stack.Screen 
                        name="Leaderboard" 
                        component={LeaderboardScreen} 
                        options={{ 
                            title: t("leaderboard1"), 
                            headerStyle: styles.headerStyle, 
                            headerTitleStyle: styles.headerTitleStyle, 
                            headerTintColor: styles.headerTintColor
                        }} 
                    />


                </Stack.Navigator>

        </NavigationContainer>
    );
}