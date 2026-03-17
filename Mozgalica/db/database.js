import * as SQLite from 'expo-sqlite';

/*const db = SQLite.openDatabaseAsync('mozgalica.db');

export const initDB = async () => {
    //db = await SQLite.openDatabaseAsync('mozgalica.db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS rezultati (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            korisnik TEXT,
            igra TEXT,
            poeni INTEGER
        );
    `);
};

export const dodajRezultat = async (korisnik, igra, poeni) => {
     try {
    await db.runAsync(
      'INSERT INTO rezultati (korisnik, igra, poeni) VALUES (?, ?, ?);',
      [korisnik, igra, poeni]
    );
    console.log("DB: Uspješno dodat rezultat", korisnik, igra, poeni);
  } catch (error) {
    console.error("DB: Greška prilikom dodavanja rezultata:", error);
  }
};

export const dohvatiRezultate = async () => {
    const result = await db.getAllAsync('SELECT * FROM rezultati');
    return result;
}; */


let db;

export const initDB = async () => {
    db = await SQLite.openDatabaseAsync('mozgalica.db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS rezultati (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            korisnik TEXT,
            igra TEXT,
            poeni INTEGER
        );
    `);
};

export const dodajRezultat = async (korisnik, igra, poeni) => {
    await db.runAsync(
        'INSERT INTO rezultati (korisnik, igra, poeni) VALUES (?, ?, ?);',
        [korisnik, igra, poeni]
    );
};

/* export const dohvatiRezultate = async () => {
    const result = await db.getAllAsync('SELECT * FROM rezultati GROUP BY korisnik, igra, poeni ORDER BY poeni DESC');
    return result;
}; */

export const dohvatiRezultate = async () => {
    const result = await db.getAllAsync('SELECT korisnik, igra, MAX(poeni) as poeni FROM rezultati GROUP BY korisnik, igra ORDER BY poeni DESC;');
    return result;
};

/* export const dohvatiRezultateFiltrirano = async (kriterijum, filter) => {
  if (!filter) {
    return await dohvatiRezultate();
  }
  let query, params;

  if (kriterijum === 'poeni') {
    query = `SELECT * FROM rezultati WHERE poeni = ?`;
    params = [parseInt(filter)];
  } else {
    query = `SELECT * FROM rezultati WHERE ${kriterijum} LIKE ?`;
    params = [`%${filter}%`];
  }

  return await db.getAllAsync(query, params);
}; */

export const dohvatiRezultateFiltrirano = async (krit, tekst) => {
  try {
    const results = await db.getAllAsync(
      `SELECT korisnik, igra, MAX(poeni) as poeni
       FROM rezultati
       WHERE ${krit} LIKE ?
       GROUP BY korisnik, igra
       ORDER BY poeni DESC;`,
      [`%${tekst}%`]
    );
    return results;
  } catch (e) {
    console.log("Greška dohvatiRezultateFiltrirano:", e);
    return [];
  }
};