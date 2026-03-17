import Toast from 'react-native-root-toast';
import  { FlatList, Pressable, SafeAreaView, StatusBar, Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { dodajRezultat } from "@/db/database";
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "@/screens/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";

const XImage = require('../assets/images/X.png');
const OImage = require('../assets/images/O.png');

const TicTacToe = ({navigation, route}) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');
    const [isCross, setIsCross] = useState(true);
    const [gameWinner, setGameWinner] = useState('');
    const [gameState, setGameState] = useState(new Array(9).fill('empty', 0, 9));
    const [scoreX, setScoreX] = useState(0);
    const [scoreO, setScoreO] = useState(0);
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

    const reloadGame = () => {
        setIsCross(true);
        setGameWinner('');
        setGameState(new Array(9).fill('empty', 0, 9));
    }

    const checkIsWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], //redovi
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], //kolone
            [0, 4, 8],
            [2, 4, 6],
        ];

        for(let [a, b, c] of lines) {
            if(squares[a] !== 'empty' && squares[a] === squares[b] && squares[b] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const minimax = (board, depth, isMaximizing) => {
        let winner = checkIsWinner(board);
        if (winner === "cross") return -10 + depth;
        if (winner === "circle") return 10 - depth;
        if (!board.includes('empty')) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            board.forEach((cell, i) => {
                if (cell === 'empty') {
                    board[i] = 'circle';
                    const score = minimax(board, depth + 1, false);
                    board[i] = 'empty';
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            board.forEach((cell, i) => {
                if (cell === 'empty') {
                    board[i] = 'cross';
                    const score = minimax(board, depth + 1, true);
                    board[i] = 'empty';
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    }

    const bestMove = (board) => {
        let bestScore = -Infinity;
        let move;
        board.forEach((cell, i) => {
            if (cell === 'empty') {
                board[i] = 'circle';
                const score = minimax(board, 0, false);
                board[i] = 'empty';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        });
        return move;
    }

    const easyAIMove = (board) => {
        const emptyIndices = board.map((cell, i) => cell === 'empty' ? i : null).filter(i => i !== null);
        if (emptyIndices.length === 0) return undefined;
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        return randomIndex;
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", async () => {
        try {
            await dodajRezultat(korisnik, "Tic-Tac-Toe", scoreX);
            //console.log("Rezultat spremljen:", korisnik, scoreX);
        } catch (e) {
            console.log("Greška kod spremanja rezultata:", e);
        }
        });

        return unsubscribe;
    }, [navigation, korisnik, scoreX, scoreO]);

    const onChangeItem = (itemNumber) => {
        if(gameWinner) {
            return Toast.show(gameWinner,{
                backgroundColor: '#000000',
                textColor: '#ffffff'
            })
        }

        if(gameState[itemNumber] === 'empty'){
            const newGameState = [...gameState];
            newGameState[itemNumber] = 'cross'; // Player X
            setGameState(newGameState);
            setIsCross(!isCross);

            let winner = checkIsWinner(newGameState);
            if(winner === 'cross') {
                //setGameWinner(winner === 'cross' ? 'Player X wins! ' : 'Player O wins! ');
                setGameWinner(t("playerXWins"));
                setScoreX(prev => prev + 1);
                return;
            /* } else if(winner === 'circle'){
                setGameWinner('Player O wins! ');
                setScoreO(prev => prev + 1); */
            }else if (!newGameState.includes('empty')) {
                setGameWinner(t("draw"));
                return;
            }

            let aiMove;
            if (difficulty === 'easy') {
                aiMove = easyAIMove(newGameState); // nasumično
            } else {
                aiMove = bestMove(newGameState); // hard minimax
            }

            if (aiMove !== undefined) {
                newGameState[aiMove] = 'circle';
                setGameState(newGameState);
                winner = checkIsWinner(newGameState);
                setIsCross(!isCross);
                if (winner === 'circle') {
                    setGameWinner(t("playerOWins"));
                    setScoreO(prev => prev + 1);
                } else if (!newGameState.includes('empty')) {
                    setGameWinner(t("draw"));
                }
            }
        } else {
            return Toast.show({
                text: "Position is already filled",
                backgroundColor: "red",
                textColor: '#ffffff'
            }) 
        }
    }

    return(
        <SafeAreaView style={gameStyle.container}>
            <StatusBar/>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 1, gap: 25 }}>
                <Pressable style={[
                    gameStyle.diffBtn, 
                    { backgroundColor: difficulty === 'easy' ? '#70B7F2' : '#002379' }
                ]}  
                    onPress={() => setDifficulty('easy')}>
                    <Text style={gameStyle.diffBtnText}>{t("easy")}</Text>
                </Pressable>
                <Pressable style={[
                    gameStyle.diffBtn, 
                    { backgroundColor: difficulty === 'hard' ? '#9B177E' : '#002379' }
                ]} 
                    onPress={() => setDifficulty('hard')}>
                    <Text style={gameStyle.diffBtnText}>{t("hard")}</Text>
                </Pressable>
            </View>

            <View>
                {gameWinner ? (
                    <View style={[gameStyle.playerInfo, gameStyle.winnerInfo]}>
                        <Text style={gameStyle.winnerText}>{gameWinner}</Text>
                    </View>
                ) : (
                    <View style={[gameStyle.playerInfo, isCross ? gameStyle.playerX : gameStyle.playerO]}>
                        <Text style={gameStyle.gameTurnText}>
                            {t("playerTurn")} {isCross ? 'X' : 'O'} 
                        </Text>
                    </View>
                )}

                {/* <View style={gameStyle.scoreContainer}>
                    <Text style={gameStyle.score}>X : {scoreX} | O : {scoreO}</Text>
                </View> */}

                <View style={gameStyle.scoreBoard}>
                    <View style={gameStyle.scoreBox}>
                        <Icon name="times" size={42} color='#9B177E' />
                        <Text style={gameStyle.playerScore}>{scoreX}</Text>
                    </View>
                    <View style={gameStyle.scoreBox}>
                        <Icon name="circle" size={42} color='#70B7F2' />
                        <Icon name="circle" size={24} color='#f2f2f2' style={{ position: "absolute", marginTop: 20.7 }} />
                        {/* <Icon name="circle-thin" size={42} color='#70B7F2' />
                        <Icon name="circle-thin" size={38} color="#70B7F2" style={{ position: "absolute", marginTop: 14 }} />
                        <Icon name="circle-thin" size={34} color="#70B7F2" style={{ position: "absolute", marginTop: 15.8 }} />  */}
                        <Text style={gameStyle.playerScore}>{scoreO}</Text>
                    </View>
                </View>
                

                {/* Game grid */}
                <FlatList 
                    style={gameStyle.grid }
                    numColumns={3}
                    data={gameState}
                    renderItem={({item, index}) => {
                        const isLastColumn = (index + 1) % 3 === 0;
                        const isLastRow = index >= 6;

                        return (
                            <TouchableOpacity
                            key={index}
                            style={[
                                gameStyle.card,
                                {
                                borderRightWidth: isLastColumn ? 0 : 2,
                                borderBottomWidth: isLastRow ? 0 : 2,
                                }
                            ]}
                            onPress={() => onChangeItem(index)}
                            >
                            {item === 'circle' ? (
                                <View>
                                    <Icon name="circle" size={42} color='#70B7F2' />
                                    <Icon name="circle" size={24} color='#ffffd4' style={{ position: "absolute", marginTop: 9.2, marginLeft: 8 }} />
                                </View>
                                
                            ) : item === 'cross' ? (
                                <Icon name="times" size={42} color='#9B177E' />
                            ) : null}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <Pressable
            style={gameStyle.gameBtn}
            onPress={reloadGame}
            >
                <Text style={gameStyle.gameBtnText}>
                    {gameWinner ? t("startNewGame") : t("reloadGame")}
                </Text>
            </Pressable>

            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                game="Tic-Tac-Toe"
                transparent={true}
            />
            
        </SafeAreaView>
    );
}

const gameStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffd4', 
    },
    scoreBoard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    scoreBox: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },

    playerLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#0E2148',
    },

    playerScore: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0E2148',
    },
    playerInfo: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center', 

        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        marginHorizontal: 14,

        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowColor: '#333',
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    gameTurnText: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: '600',
    },
    playerX: {
        backgroundColor: '#9B177E',
    },
    playerO: {
        backgroundColor: '#70B7F2',
    },
    grid: {
        marginTop: 32,
        marginBottom: 42,
        marginLeft: 18,
        marginRight: 18,
    },
    card: {
        height: 105,
        width: '33.33%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#0E2148',
        backgroundColor : '#ffffd4'
    },
    winnerInfo: {
        borderRadius: 8,
        backgroundColor: '#E8988A',
        shadowOpacity: 0.1,
    },
    winnerText: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    gameBtn: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 36,
        backgroundColor: '#002379',
    },
    gameBtnText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '500',
    },
    diffBtn: { 
        backgroundColor: '#002379', 
        padding: 10, 
        marginVertical: 10, 
        borderRadius: 10, 
        width: 100, 
        alignItems: 'center', 
    },
    diffBtnText: { 
        color: '#fff', 
        fontSize: 15, 
        fontWeight: '600' 
    }
});

export default TicTacToe;