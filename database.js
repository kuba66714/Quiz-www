"use strict";
exports.__esModule = true;
var sqlite3 = require("sqlite3");
module.exports.getPasswordHash = function getPasswordHash(name, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.get('SELECT password_hash FROM user WHERE name = ?;', [name], function (err, row) {
        if (err) {
            callback(err, null);
        }
        else if (row) {
            callback(null, row.password_hash);
        }
        else {
            callback(null, null);
        }
        db.close();
    });
};
module.exports.getUsernames = function getUsernames(callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    var result = [];
    db.all("SELECT name FROM user;", [], function (err, rows) {
        if (err)
            callback(err, null);
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var name_1 = rows_1[_i].name;
            result.push(name_1);
        }
        callback(null, result);
        db.close();
    });
};
module.exports.insertUser = function insertUser(name, password_hash) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("INSERT INTO user(name, password_hash) VALUES(?, ?);", [name, password_hash], function (err) {
        if (err)
            throw err;
    });
    db.close();
};
module.exports.changePassword = function changePassword(name, password_hash, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("UPDATE user SET password_hash = ? WHERE name = ?;", [password_hash, name], function (err) {
        if (err)
            throw err;
        callback();
    });
    db.close();
};
module.exports.insertDoneTest = function insertDoneTest(name, testId) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("INSERT INTO doneTests(name, testId) VALUES(?, ?);", [name, testId], function (err) {
        if (err)
            throw err;
    });
    db.close();
};
module.exports.insertTestData = function insertTestData(username, testId, questionId, time, answer, isCorrect) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("INSERT INTO userAnswers(username, testId, questionId, time, answer, isCorrect) VALUES(?, ?, ?, ?, ?, ?);", [username, testId, questionId, time, answer, isCorrect], function (err) {
        if (err)
            throw err;
    });
    db.close();
};
module.exports.getTestData = function getTestData(username, testId, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.all("SELECT questionId, time, answer, isCorrect FROM userAnswers WHERE username = ? AND testId = ?;", [username, testId], function (err, rows) {
        if (err)
            callback(err, null);
        callback(null, rows);
        db.close();
    });
};
module.exports.getTestDataForAll = function getTestDataForAll(testId, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.all("SELECT username, questionId, time, answer, isCorrect FROM userAnswers WHERE testId = ?;", [testId], function (err, rows) {
        if (err)
            callback(err, null);
        callback(null, rows);
        db.close();
    });
};
module.exports.insertTotalScore = function insertTotalScore(username, testId, totalScore) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("INSERT INTO totalScores(username, testId, totalScore) VALUES(?, ?, ?);", [username, testId, totalScore], function (err) {
        if (err)
            throw err;
    });
    db.close();
};
module.exports.getUndoneTests = function getUndoneTests(username, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    var result = [];
    db.all("SELECT id, test FROM tests WHERE id NOT IN \n    (SELECT id FROM tests JOIN doneTests ON tests.id = doneTests.testId WHERE name = ?);", [username], function (err, rows) {
        if (err)
            callback(err, null);
        for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
            var _a = rows_2[_i], id = _a.id, test = _a.test;
            result.push({ id: id, test: JSON.parse(test) });
        }
        callback(null, result);
        db.close();
    });
};
module.exports.getDoneTestsIds = function getDoneTestsIds(username, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.all("SELECT testId FROM doneTests WHERE name = ?;", [username], function (err, rows) {
        if (err)
            callback(err, null);
        callback(null, rows);
        db.close();
    });
};
module.exports.getTest = function getTest(id, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.get('SELECT test FROM tests WHERE id = ?;', [id], function (err, row) {
        if (err) {
            callback(err, null);
        }
        else if (row) {
            callback(null, row.test);
        }
        else {
            callback(null, null);
        }
        db.close();
    });
};
module.exports.getTotalScore = function getTotalScore(testId, callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.all("SELECT username, totalScore FROM totalScores WHERE testId = ?;", [testId], function (err, rows) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, rows);
        }
    });
    db.close();
};
