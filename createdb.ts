import * as sqlite3 from 'sqlite3';
const md5 = require('md5');
function createDatabse(callback) {

    let db = new sqlite3.Database('bazaDanych.db');

    db.run(`CREATE TABLE IF NOT EXISTS user (
        name TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    );`, (err) => {
        if (err) {
            throw err;
        } else {
            db.run(`CREATE TABLE IF NOT EXISTS tests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              test TEXT NOT NULL
    );`, (err) => {
        if (err) {
            throw err;
        } else {
            db.run(`CREATE TABLE IF NOT EXISTS doneTests (
                name TEXT,
                testId INTEGER
            );`, (err) => {
                if (err) {
                    throw err;
                } else {
                    db.run(`CREATE TABLE IF NOT EXISTS userAnswers (
                      username TEXT,
                      testId INTEGER,
                      questionId INTEGER,
                      time FLOAT,
                      answer TEXT,
                      isCorrect BOOL
                    );`, (err) => {
                      if (err) {
                        throw err;
                      } else {
                        db.run(`CREATE TABLE IF NOT EXISTS totalScores (
                          username TEXT,
                          testId NUMBER,
                          totalScore NUMBER
                        );`, (err) => {
                          if (err) {
                            throw err;
                          } else {
                            callback();
                          }
                        });
                      }
                    });
                }
            });
        }
    });
        }
    });

    db.close();
}

function insertUser(name: string, password_hash: string) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`INSERT INTO user(name, password_hash) VALUES(?, ?);`,
            [name, password_hash], (err) => {
                if (err)
                    throw err;
    });
    db.close();
}

function insertTest(test: string) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`INSERT INTO tests(test) VALUES(?);`,
            [test], (err) => {
                if (err)
                    throw err;
    });
    db.close();
}

let test1: string = `{
    "questions": [
        {
          "number": 1,
          "question": "Ile wynosi 2 + 2 * 2",
          "correct_answer": "6",
          "penalty": 2
        },
        {
          "number": 2,
          "question": "Nastepny wyraz ciagu 1, 4, 16, 64",
          "correct_answer": "256",
          "penalty": 4
        },
        {
          "number": 3,
          "question": "Ile wynosi 5!",
          "correct_answer": "120",
          "penalty": 6
        },
        {
          "number": 4,
          "question": "Na ile sposobow mozna wybrac podzbiory 2-elementowe ze zbioru 5 elementowego",
          "correct_answer": "10",
          "penalty": 7
        }
      ]
    }`;

    let test2: string = `{
        "questions": [
            {
              "number": 1,
              "question": "Ile wynosi 4 + 4 * 4",
              "correct_answer": "20",
              "penalty": 2
            },
            {
              "number": 2,
              "question": "Nastepny wyraz ciagu 1, 2, 4, 8",
              "correct_answer": "16",
              "penalty": 4
            },
            {
              "number": 3,
              "question": "Ile wynosi 6!",
              "correct_answer": "720",
              "penalty": 6
            },
            {
              "number": 4,
              "question": "Na ile sposobow mozna wybrac podzbiory 2-elementowe ze zbioru 6 elementowego",
              "correct_answer": "15",
              "penalty": 7
            }
          ]
        }`;
createDatabse(() => {
let password_hash = md5("user1");
let password_hash2 = md5("user2");
insertUser("user1", password_hash);
insertUser("user2", password_hash2);
insertTest(test1);
insertTest(test2);
});

