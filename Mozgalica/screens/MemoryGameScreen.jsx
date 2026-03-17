import { dodajRezultat } from "@/db/database";
import React, {useEffect, useRef, useState, useLayoutEffect} from "react";
import {View, FlatList, Alert, Text, StyleSheet, TouchableOpacity, Image, Animated, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "@/screens/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";

const Card = ({ item, onPress, isFlipped }) => {
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(flipAnim, {
            toValue: isFlipped || item.matched ? 180 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isFlipped, item.matched]);

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
        position: 'absolute',
        top: 0,
    };

    const cardStyle = isFlipped || item.matched
        ? [styles.card, { backgroundColor: getCardColor(item.img) }]
        : [styles.card, { backgroundColor: 'lightgray' }]; // back side

    return (
        <TouchableOpacity onPress={onPress} style={styles.cardWrapper}>
            {/* Leđa (zatvorena kartica) */}
            <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: 'lightgray'}]}>
                <Image source={require('../assets/images/back.png')} style={styles.icon} />
            </Animated.View>

            {/* Prednja strana (otvorena) */}
            <Animated.View style={[styles.card, backAnimatedStyle, { backgroundColor: getCardColor(item.img) }]}>
                <Image source={item.img} style={styles.icon} />
            </Animated.View>
            
        </TouchableOpacity>
    );
};

const icons = [
    require('../assets/images/square (2).png'),
    require('../assets/images/triangle.png'),
    require('../assets/images/circle (2).png'),
    require('../assets/images/star.png'),
    require('../assets/images/rhombus.png'),
    require('../assets/images/clover.png'),
    require('../assets/images/diamonds.png'),
    require('../assets/images/hexagon.png'),
];

const getCardColor = (img) => {
    switch (img) {
        case icons[0]: return '#E87187'; // square
        case icons[1]: return '#5FA8ED'; // triangle
        case icons[2]: return '#5FCDA4'; // circle
        case icons[3]: return '#F3CE7D'; // star
        case icons[4]: return '#E1BEE7'; // rhombus
        case icons[5]: return '#9E26B3'; // clover
        case icons[6]: return '#B2EBF2'; // diamonds
        case icons[7]: return '#75C347'; // hexagon
        default: return 'lightgray';       // default gray
    }
};

function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}

const MemoryGame = ({navigation, route}) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matchedCount, setMatchedCount] = useState(0);
    const [score, setScore] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const {korisnik} = route.params;
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

    useEffect(() => {
        const doubleIcons = icons.concat(icons).map((img,index) => ({
            id: index.toString(),
            img,
            matched: false,
        }));
        setCards(shuffleArray(doubleIcons));
    }, []);

    useEffect(() => {
        if (matchedCount === icons.length) {
            //console.log("Korisnik iz route.params:", korisnik, score);
            dodajRezultat(korisnik, 'Memory', score);
            setTimeout(() => setModalVisible(true), 500);
        }
    }, [matchedCount]);

    const resetGame = () => {
        const doubleIcons = icons.concat(icons).map((img, index) => ({
            id: index.toString(),
            img,
            matched: false,
        }));
        setCards(shuffleArray(doubleIcons));
        setSelected([]);
        setMatchedCount(0);
        setScore(0);
    };

    const handleCardPress = (index) => {
        if(selected.includes(index) || cards[index].matched) return;
        if(selected.length === 2) return;

        const newSelected = [...selected, index];
        setSelected(newSelected);

        if(newSelected.length === 2) {
            //setScore(prev => prev + 1); // +1 pokušaj svaki put kada se klikne druga kartica
            const [first, second] = newSelected;
            if(cards[first].img === cards[second].img && first !== second) {
                setScore(prev => prev + 10); //pogodak -> dodaj bodove
                const newCards = [...cards];
                newCards[first].matched = true;
                newCards[second].matched = true;
                setCards(newCards);
                setMatchedCount((prev) => {
                const updated = prev + 1;
                /* if (updated === icons.length) {
                        //Alert.alert('Čestitamo!', 'Pronašli ste sve parove!');
                    }, 500);
                } */
                return updated;
            });
            setTimeout(() => setSelected([]), 500); // kratak delay i za par
            } else {
                // ako nije par, okreni nazad nakon 1 sekunde i promašaj -> oduzmi bodove
                setScore(prev => Math.max(0, prev - 2));
                setTimeout(() => {
                    setSelected([]);
                }, 1000);
            }
        }
    };

    const renderCard = ({item, index}) => (
        <Card
            item={item}
            isFlipped={selected.includes(index)}
            onPress={() => handleCardPress(index)}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <FlatList
                data={cards}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                numColumns={4}
                contentContainerStyle={styles.board}
            />

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{t("congratulations")}</Text>
                        <Text style={styles.modalText}>{t("foundAllPairs")}</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    resetGame();
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>{t("tryAgain")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.modalButtonText}>{t("goBack")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={resetGame} style={styles.restartButton} >
                <Text style={styles.restartText} >{t("restart")}</Text>
            </TouchableOpacity>

            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                game="Memory"
                transparent={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        width: 80,
        height: 80,
        margin: 5,
    },
    card: {
        margin: 5,
        width: 80,
        height: 80,
        borderRadius: 10,
        padding: 22,
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
    },
    icon: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    container: { 
        flex: 1, 
        paddingTop: 100, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffd4',
        gap: 20,
    },
    scoreText: { 
        fontSize: 24, 
        marginBottom: 20,
        textAlign: 'center',
    },
    board: { 
        alignItems: 'center' 
    },
    restartButton: {
        backgroundColor: '#347433',
        borderRadius: 15,
        marginBottom: 110,
        width: 120,
        height: 50,
        justifyContent: 'center',
    },
    restartText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#347433',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MemoryGame;