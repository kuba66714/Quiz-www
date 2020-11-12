import * as sqlite3 from 'sqlite3';

module.exports.getPasswordHash = function getPasswordHash(name: string, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.get('SELECT password_hash FROM user WHERE name = ?;', [name], (err, row) => {
        if (err) {
            callback(err, null);
        } else if (row) {
            callback(null, row.password_hash);
        } else {
            callback(null, null);
        }
        db.close();
    });
}

module.exports.getUsernames = function getUsernames(callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    let result: string[] = [];
    db.all(`SELECT name FROM user;`, [], (err, rows) => {
            if (err)
                callback(err, null);
            for (let {name} of rows)
                result.push(name);
            callback(null, result);
            db.close();
    });
}

module.exports.insertUser = function insertUser(name: string, password_hash: string) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`INSERT INTO user(name, password_hash) VALUES(?, ?);`,
            [name, password_hash], (err) => {
                if (err)
                    throw err;
    });
    db.close();
}

module.exports.changePassword = function changePassword(name: string, password_hash: string, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`UPDATE user SET password_hash = ? WHERE name = ?;`,
            [password_hash, name], (err) => {
                if (err)
                    throw err;
                callback();
    });
    db.close();
}

module.exports.insertDoneTest = function insertDoneTest(name: string, testId: number) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`INSERT INTO doneTests(name, testId) VALUES(?, ?);`,
            [name, testId], (err) => {
                if (err)
                    throw err;
    });
    db.close();
}

module.exports.insertTestData = function insertTestData(username: string, testId: number, questionId: number, 
    time: number, answer: string, isCorrect: boolean) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`INSERT INTO userAnswers(username, testId, questionId, time, answer, isCorrect) VALUES(?, ?, ?, ?, ?, ?);`,
            [username, testId, questionId, time, answer, isCorrect], (err) => {
                if (err)
                    throw err;
    });
    db.close();
}

module.exports.getTestData = function getTestData(username, testId, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.all(`SELECT questionId, time, answer, isCorrect FROM userAnswers WHERE username = ? AND testId = ?;`, [username, testId], (err, rows) => {
            if (err)
                callback(err, null);

            callback(null, rows);
            db.close();
    });
}

module.exports.getTestDataForAll = function getTestDataForAll(testId, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.all(`SELECT username, questionId, time, answer, isCorrect FROM userAnswers WHERE testId = ?;`, [testId], (err, rows) => {
            if (err)
                callback(err, null);

            callback(null, rows);
            db.close();
    });
}

module.exports.insertTotalScore = function insertTotalScore(username: string, testId: number, totalScore: number) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.run(`INSERT INTO totalScores(username, testId, totalScore) VALUES(?, ?, ?);`,
            [username, testId, totalScore], (err) => {
                if (err)
                    throw err;
    });
    db.close();
}

module.exports.getUndoneTests = function getUndoneTests(username, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    let result = [];
    db.all(`SELECT id, test FROM tests WHERE id NOT IN 
    (SELECT id FROM tests JOIN doneTests ON tests.id = doneTests.testId WHERE name = ?);`, [username], (err, rows) => {
            if (err)
                callback(err, null);
            for (let {id, test} of rows)
                result.push({id: id, test: JSON.parse(test)});
            callback(null, result);
            db.close();
    });
}

module.exports.getDoneTestsIds = function getDoneTestsIds(username, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.all(`SELECT testId FROM doneTests WHERE name = ?;`, [username], (err, rows) => {
            if (err)
                callback(err, null);

            callback(null, rows);
            db.close();
    });
}

module.exports.getTest = function getTest(id: number, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.get('SELECT test FROM tests WHERE id = ?;', [id], (err, row) => {
        if (err) {
            callback(err, null);
        } else if (row) {
            callback(null, row.test);
        } else {
            callback(null, null);
        }
        db.close();
    });
}

module.exports.getTotalScore = function getTotalScore(testId: number, callback) {
    let db = new sqlite3.Database('bazaDanych.db');
    db.all(`SELECT username, totalScore FROM totalScores WHERE testId = ?;`, [testId], (err, rows) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, rows);
                }
    });
    db.close();
}