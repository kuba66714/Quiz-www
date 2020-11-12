"use strict";
exports.__esModule = true;
var sqlite3 = require("sqlite3");
var md5 = require('md5');
function createDatabse(callback) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("CREATE TABLE IF NOT EXISTS user (\n        name TEXT NOT NULL UNIQUE,\n        password_hash TEXT NOT NULL\n    );", function (err) {
        if (err) {
            throw err;
        }
        else {
            db.run("CREATE TABLE IF NOT EXISTS tests (\n              id INTEGER PRIMARY KEY AUTOINCREMENT,\n              test TEXT NOT NULL\n    );", function (err) {
                if (err) {
                    throw err;
                }
                else {
                    db.run("CREATE TABLE IF NOT EXISTS doneTests (\n                name TEXT,\n                testId INTEGER\n            );", function (err) {
                        if (err) {
                            throw err;
                        }
                        else {
                            db.run("CREATE TABLE IF NOT EXISTS userAnswers (\n                      username TEXT,\n                      testId INTEGER,\n                      questionId INTEGER,\n                      time FLOAT,\n                      answer TEXT,\n                      isCorrect BOOL\n                    );", function (err) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    db.run("CREATE TABLE IF NOT EXISTS totalScores (\n                          username TEXT,\n                          testId NUMBER,\n                          totalScore NUMBER\n                        );", function (err) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
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
function insertUser(name, password_hash) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("INSERT INTO user(name, password_hash) VALUES(?, ?);", [name, password_hash], function (err) {
        if (err)
            throw err;
    });
    db.close();
}
function insertTest(test) {
    var db = new sqlite3.Database('bazaDanych.db');
    db.run("INSERT INTO tests(test) VALUES(?);", [test], function (err) {
        if (err)
            throw err;
    });
    db.close();
}
var test1 = "{\n    \"questions\": [\n        {\n          \"number\": 1,\n          \"question\": \"Ile wynosi 2 + 2 * 2\",\n          \"correct_answer\": \"6\",\n          \"penalty\": 2\n        },\n        {\n          \"number\": 2,\n          \"question\": \"Nastepny wyraz ciagu 1, 4, 16, 64\",\n          \"correct_answer\": \"256\",\n          \"penalty\": 4\n        },\n        {\n          \"number\": 3,\n          \"question\": \"Ile wynosi 5!\",\n          \"correct_answer\": \"120\",\n          \"penalty\": 6\n        },\n        {\n          \"number\": 4,\n          \"question\": \"Na ile sposobow mozna wybrac podzbiory 2-elementowe ze zbioru 5 elementowego\",\n          \"correct_answer\": \"10\",\n          \"penalty\": 7\n        }\n      ]\n    }";
var test2 = "{\n        \"questions\": [\n            {\n              \"number\": 1,\n              \"question\": \"Ile wynosi 4 + 4 * 4\",\n              \"correct_answer\": \"20\",\n              \"penalty\": 2\n            },\n            {\n              \"number\": 2,\n              \"question\": \"Nastepny wyraz ciagu 1, 2, 4, 8\",\n              \"correct_answer\": \"16\",\n              \"penalty\": 4\n            },\n            {\n              \"number\": 3,\n              \"question\": \"Ile wynosi 6!\",\n              \"correct_answer\": \"720\",\n              \"penalty\": 6\n            },\n            {\n              \"number\": 4,\n              \"question\": \"Na ile sposobow mozna wybrac podzbiory 2-elementowe ze zbioru 6 elementowego\",\n              \"correct_answer\": \"15\",\n              \"penalty\": 7\n            }\n          ]\n        }";
createDatabse(function () {
    var password_hash = md5("user1");
    var password_hash2 = md5("user2");
    insertUser("user1", password_hash);
    insertUser("user2", password_hash2);
    insertTest(test1);
    insertTest(test2);
});
