import React, { createContext, useState, useContext } from "react";

const translations = {
  sr: {
    welcome: "Dobrodošli",

    user: "Korisničko ime:",
    continue: "NASTAVI",

    leaderboard: "🏆 Rang lista",
    tttGame: "Iks-Oks",
    memoryGame: "Igra memorije",

    settings: "⚙️ Podešavanja",
    language: "Jezik:",
    rules: "📖 Pravila:",
    close: "Zatvori",
    score: "Score",
    gameOver: "Kraj igre",
    restart: "Restart",
    goBack: "Nazad",
    memory: "Pronađi sve parove kartica u što manje poteza.\nPogodak daje +10 bodova, promašaj -2.",
    ttt: "Igrači naizmjenično postavljaju X i O. Cilj je spojiti tri u nizu. \nPoen se dodjeljuje za svaku pobjedu.",
    game2048: "Pomeraj pločice i spajaj iste brojeve da stigneš do 2048! \nBroj poena je zbir vrijednosti pločica.",

    playerTurn: "Na potezu je igrač",
    reloadGame: "Ponovo pokreni igru",
    playerXWins: "Igrač X pobijedio!",
    playerOWins: "Igrač O pobijedio!",
    draw: "Neriješeno ¯\\_(ツ)_/¯",
    playerXTurn: "Na potezu je X",
    playerOTurn: "Na potezu je O",
    reloadGame: "Ponovo igraj",
    startNewGame: "Nova igra",
    easy: "Lako",
    hard: "Teško",

    congratulations: "🎉 Bravo!",
    foundAllPairs: "Pronašli ste sve parove!",
    tryAgain: "Ponovo igraj",

    win2048: "🎉 Dostigli ste 2048! Možete nastaviti igrati!",

    leaderboard1: "Rang lista",
    search: "Pretraga:",
    user1: "Korisnik",
    game: "Igra",
    score: "Poeni",
    filterBy: "Filtriraj po ",

  },
  en: {
    welcome: "Welcome",

    user: "User name:",
    continue: "CONTINUE",

    leaderboard: "🏆 Leaderboard",
    tttGame: "Tic-Tac-Toe",
    memoryGame: "Memory Game",

    settings: "⚙️ Settings",
    language: "Language:",
    rules: "📖 Rules:",
    close: "Close",
    score: "Score",
    gameOver: "Game Over",
    restart: "Restart",
    goBack: "Go Back",
    memory: "Find all pairs of cards in as few moves as possible.\nMatch correctly and you get +10 point, otherwise -2 points.",
    ttt: "Players take turns placing X and O. Goal: connect three in a row. \nYou get a point for every win.",
    game2048: "Move tiles and merge same numbers to reach 2048! \nThe score is the sum of tiles on the board.",

    playerTurn: "Player's turn: ",
    reloadGame: "Reload the game",
    playerXWins: "Player X wins!",
    playerOWins: "Player O wins!",
    draw: "Draw ¯\\_(ツ)_/¯",
    playerXTurn: "Player X's turn",
    playerOTurn: "Player O's turn",
    reloadGame: "Reload the game",
    startNewGame: "Start new game",
    easy: "Easy",
    hard: "Hard",

    congratulations: "🎉 Congratulations!",
    foundAllPairs: "You found all pairs!",
    tryAgain: "Try Again",

    win2048: "🎉 You've reached 2048! You can continue to play!",

    leaderboard1: "Leaderboard",
    search: "Search:",
    user1: "User name",
    game: "Game",
    score: "Score",
    filterBy: "Filter by ",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("sr");

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);