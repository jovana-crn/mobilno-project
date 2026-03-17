import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, PanResponder, Modal, TouchableOpacity} from 'react-native';
import { dodajRezultat } from "@/db/database";
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "@/screens/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";

const getCellStyle = (number) => {
  const key = `cell${number}`;
  return [styles.cell, styles[key]];
};

const Cell = ({ number }) => {
    return (
        <View style={getCellStyle(number)}>
            <Text style={styles.cellText}>{ number > 0 ? number : '' }</Text>
        </View>
    )
};

const GameController = ({navigation, route}) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [board, setBoard] = useState(generateRandom(getEmptyBoard()));
    const [hasWon, setHasWon] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const [showGameOverModal, setShowGameOverModal] = useState(false);
    const [score, setScore] = useState(0);
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

    const swipeResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (e, gesture) => {
            const { dx, dy } = gesture;

            if(Math.abs(dx) > Math.abs(dy)) {
                if(dx > 50) {
                    move('right');
                }else if(dx < -50) {
                    move('left');
                }
            }else {
                if(dy > 50) {
                    move('down');
                }else if(dy < -50) {
                    move('up');
                }
            }
        },
    });

    const restartGame = () => {
      const empty = getEmptyBoard();
      const newBoard = generateRandom(empty);
      setBoard(newBoard);
      setHasWon(false);
      setShowGameOverModal(false);
    };

    const calculateScore = (board) => {
      return board.flat().reduce((sum, val) => sum + val, 0);
    };

    useEffect(() => {
      setScore(calculateScore(board));
    }, [board]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", async () => {
        try {
            await dodajRezultat(korisnik, '2048',score);
            console.log("Rezultat spremljen:", korisnik, score);
        } catch (e) {
            console.log("Greška kod spremanja rezultata:", e);
        }
        });

        return unsubscribe;
    }, [navigation, korisnik, score]);

    const move = (direction) => {
        let newBoard;
        switch (direction) {
            case 'left':
                newBoard = moveLeft(board);
                break;
            case 'right':
                newBoard = moveRight(board);
                break;
            case 'up':
                newBoard = moveUp(board);
                break;
            case 'down':
                newBoard = moveDown(board);
                break;
        }

        /* setBoard(generateRandom(newBoard));
        if(checkWin(newBoard)) alert("You win!");
        else if(isOver(newBoard)) alert("Game over!"); */

      //if (!hasDiff(board, newBoard)) return; // Ne dodaj novu ako se ništa nije promijenilo

      const withRandom = generateRandom(newBoard);
      setBoard(withRandom);

      if (!hasWon && checkWin(withRandom)) {
          setHasWon(true);
          alert("🎉 You reached 2048! You can keep playing!");
      } else if (isOver(withRandom)) {
          dodajRezultat(korisnik, '2048', score);
          setShowGameOverModal(true);
      }
    };

    return (
        <View style={styles.board}
              {...(!showGameOverModal && !settingsVisible ? swipeResponder.panHandlers : {})}
        >
          <Text style={styles.scoreText} >{t("score")}: {score}</Text>
            {board.map((row, i) => (
                <View key={i} style={styles.row}>
                    {row.map((cell, j) => (
                        <Cell key={`${i}-${j}`} number={cell} />
                    ))}
                </View>
            ))}

            <Modal
              visible={showGameOverModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowGameOverModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{t("gameOver")}</Text>
                  <Text style={styles.modalSubtext}>{t("score")} {score}</Text>
                  <TouchableOpacity style={styles.modalButtonRestart} onPress={restartGame}>
                    <Text style={styles.modalButtonText}>Restart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.modalButtonText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                game="2048"
                transparent={true}
            />
        </View>
    );
};

const getEmptyBoard = () => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

const hasValue = (board, value) => {
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j] === value) {
                return true;
            }
        }
    }
    return false;
};

const isFull = (board) => {
    return !hasValue(board, 0);
};

const getRandomPosition = () => {
    const rowPos = Math.floor(Math.random() * 4);
    const colPos = Math.floor(Math.random() * 4);
    return [rowPos, colPos];
};

const generateRandom = (board) => {
    if (isFull(board)) {
        return board;
    }

    let [row, col] = getRandomPosition();
    while (board[row][col] !== 0) {
        [row, col] = getRandomPosition();
    }

    board[row][col] = 2;
    return board;
};

const merge = (board) => {
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length - 1; j++){
            if(board[i][j] !== 0 && board[i][j] === board[i][j + 1]){
                board[i][j] = board[i][j] * 2;
                board[i][j + 1] = 0;
            }
        }
    }

    return board;
};

const compress = (board) => {
    const newBoard = getEmptyBoard();
    for(let i = 0; i < board.length; i++){
        let colIndex = 0;
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j] !== 0){
                newBoard[i][colIndex] = board[i][j];
                colIndex++;
            }
        }
    }
    return newBoard;
};

const moveLeft = (board) => {
    const newBoard1 = compress(board);
    const newBoard2 = merge(newBoard1);
    return compress(newBoard2);
};

const reverse = (board) => {
    const reverseBoard = getEmptyBoard();

    for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        reverseBoard[i][j] = board[i][board[i].length - 1 - j];
        }
    }

    return reverseBoard;
};

const moveRight = (board) => {
    const reverseBoard = reverse(board);
    const newBoard = moveLeft(reverseBoard);
    return reverse(newBoard);
};

const rotateLeft = (board) => {
  const rotateBoard = getEmptyBoard();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      rotateBoard[i][j] = board[j][board[i].length - 1 - i];
    }
  }

  return rotateBoard;
};

const rotateRight = (board) => {
  const rotateBoard = getEmptyBoard();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      rotateBoard[i][j] = board[board[i].length - 1 - j][i];
    }
  }

  return rotateBoard;
};

const moveUp = (board) => {
  const rotateBoard = rotateLeft(board);
  const newBoard = moveLeft(rotateBoard);
  return rotateRight(newBoard);
};

const moveDown = (board) => {
  const rotateBoard = rotateRight(board);
  const newBoard = moveLeft(rotateBoard);
  return rotateLeft(newBoard);
};

const checkWin = (board) => {
  return hasValue(board, 2048);
};

const hasDiff = (board, updatedBoard) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== updatedBoard[i][j]) {
        return true;
      }
    }
  }
  return false;
};

const isOver = (board) => {
  if (hasDiff(board, moveLeft(board))) {
    return false;
  }
  if (hasDiff(board, moveRight(board))) {
    return false;
  }
  if (hasDiff(board, moveUp(board))) {
    return false;
  }
  if (hasDiff(board, moveDown(board))) {
    return false;
  }
  return true;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalSubtext: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ff6f3c',
    paddingVertical: 10,
    borderRadius: 10,
    width: 105,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtonRestart: {
    backgroundColor: '#46866E',
    color: 'white',
    paddingVertical: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    width: 105,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  board: {
    backgroundColor: 'olive',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 8,
    gap: 8, 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    height: 90,
    gap: 8,
  },
  cell: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
    width: 82,
    height: 82,
  },
  cellText: {
    fontSize: 24,
    fontWeight: '500',
    color: "black",
    },
  cell2: {
    backgroundColor: "#ffa600ff",
  },
  cell4: {
    backgroundColor: "#F47D43",
  },
  cell8: {
    backgroundColor: "#9ECCB2",
  },
  cell16: {
    backgroundColor: "#46866E",
  },
  cell32: {
    backgroundColor: "#84B5DD",
  },
  cell64: {
    backgroundColor: "#006CB7",
  },
  cell128: {
    backgroundColor: "#9B90C8",
  },
  cell256: {
    backgroundColor: "#762864",
  },
  cell512: {
    backgroundColor: "#17c1dbff",
  },
  cell1024: {
    backgroundColor: "gold",
  },
  cell2048: {
    backgroundColor: "aquamarine",
  },
  cell4096: {
    backgroundColor: '#657C6A',
  },
  cell8192: {
    backgroundColor: '#373A40',
  },
});

export default GameController;