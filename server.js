var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var csrf = require('csurf');
var express = require('express');
var bodyParser = require('body-parser');
var md5 = require('md5');
var multer = require('multer');
var session = require('express-session');
var fs = require('fs');
var db = require('./database');
var testsNumber = 2;
var app = express();
var upload = multer({ dest: 'tmp' });
app.set('trust proxy', 1);
app.use(session({
    secret: 'totally secret',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({}));
var csrfProtection = csrf({});
var islogged = false;
var loggedName;
var timeOnQuiz = 0;
var measure_time = false;
setInterval(function () {
    if (measure_time) {
        timeOnQuiz++;
    }
}, 1000);
app.get('/', csrfProtection, function (req, res) {
    var tests = [];
    for (var i = 0; i < testsNumber; i++) {
        tests.push({ id: i + 1 });
    }
    res.render('index', { logged_in: islogged, tests: tests, csrftoken: req.csrfToken() });
});
app.get('/logowanie', csrfProtection, function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    }
    else {
        res.render('logowanie', { warning: false, csrftoken: req.csrfToken() });
    }
});
app.post('/logowanie', csrfProtection, function (req, res) {
    if (req.session.user) {
        res.status(405).send();
    }
    else {
        var name_1 = req.body.username;
        var input_password_hash_1 = md5(req.body.password);
        db.getPasswordHash(name_1, function (err, db_password_hash) {
            if (err) {
                throw err;
            }
            else if (db_password_hash && input_password_hash_1 === db_password_hash) {
                req.session.user = name_1;
                islogged = true;
                loggedName = req.body.username;
                res.redirect('/');
            }
            else {
                res.render('logowanie', { warning: true, csrftoken: req.csrfToken() });
            }
        });
    }
});
app.get('/rejestracja', csrfProtection, function (req, res) {
    if (req.session.user) {
        res.redirect('/');
    }
    else {
        res.render('rejestracja', { csrftoken: req.csrfToken() });
    }
});
app.post('/rejestracja', csrfProtection, function (req, res) {
    var name = req.body.username;
    var password_hash = md5(req.body.password);
    db.getUsernames(function (err, usernames) {
        if (err) {
            throw err;
        }
        else if (!usernames || usernames.includes(name)) {
            res.render('rejestracja', { info: "Użytkownik o tej nazwie już istnieje.",
                csrftoken: req.csrfToken() });
        }
        else {
            db.insertUser(name, password_hash);
            req.session.user = name;
            islogged = true;
            loggedName = name;
            res.redirect('/');
        }
    });
});
app.post('/wylogowanie', function (req, res) {
    req.session.user = null;
    islogged = false;
    loggedName = null;
    res.redirect('/');
});
app.get('/zmiana_hasla', csrfProtection, function (req, res) {
    res.render('zmiana_hasla', { csrftoken: req.csrfToken() });
});
app.post('/zmiana_hasla', csrfProtection, function (req, res) {
    var newpassword = req.body.password;
    db.changePassword(loggedName, md5(newpassword), function (err) {
        if (err) {
            throw err;
        }
        else {
            req.session.user = null;
            islogged = false;
            loggedName = null;
            res.redirect('/');
        }
    });
});
app.get('/finishedTest', function (req, res) {
    measure_time = false;
});
function updateDatabase(testId, questionQuantity, timeOnQuestions, answers, answersCorrect, totalScore) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            db.insertDoneTest(loggedName, testId);
            for (i = 0; i < questionQuantity; i++) {
                db.insertTestData(loggedName, testId, i + 1, timeOnQuestions[i], answers[i], answersCorrect[i]);
            }
            db.insertTotalScore(loggedName, testId, totalScore);
            return [2 /*return*/];
        });
    });
}
app.post('/getQuizData', function (req, res) {
    var dataArr = req.body;
    var dataArrLen = dataArr.length;
    var testId = dataArr[0].testId;
    db.getTest(testId, function (err, test) {
        if (err) {
            throw err;
        }
        else if (test) {
            var testJson = JSON.parse(test).questions;
            var totalScore_1 = timeOnQuiz;
            var timeOnQuiz2 = timeOnQuiz;
            timeOnQuiz = 0;
            var questionQuantity_1 = (dataArrLen - 1) / 2;
            var timeOnQuestions_1 = new Array(questionQuantity_1);
            var answers_1 = new Array(questionQuantity_1);
            var answersCorrect_1 = new Array(questionQuantity_1);
            for (var i = 1; i < dataArrLen; i++) {
                if (dataArr[i].questionPercent) {
                    timeOnQuestions_1[dataArr[i].questionPercent - 1] = dataArr[i].percent * timeOnQuiz2;
                }
                else if (dataArr[i].questionAnswer) {
                    answers_1[dataArr[i].questionAnswer - 1] = dataArr[i].answer;
                    if (testJson[dataArr[i].questionAnswer - 1].correct_answer === dataArr[i].answer) {
                        answersCorrect_1[dataArr[i].questionAnswer - 1] = 1;
                    }
                    else {
                        answersCorrect_1[dataArr[i].questionAnswer - 1] = 0;
                        totalScore_1 += testJson[dataArr[i].questionAnswer - 1].penalty;
                    }
                }
            }
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, updateDatabase(testId, questionQuantity_1, timeOnQuestions_1, answers_1, answersCorrect_1, totalScore_1)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
        else {
            console.log("BLAD");
        }
    });
});
app.get('/getUndoneTests', function (req, res) {
    if (islogged) {
        db.getUndoneTests(loggedName, function (err, tests) {
            if (err) {
                throw err;
            }
            else {
                res.send({ tests: tests, total: testsNumber });
            }
        });
        timeOnQuiz = 0;
        measure_time = true;
    }
    else {
        res.send("niezalogowany");
    }
});
app.get('/zobaczstaty', csrfProtection, function (req, res) {
    db.getDoneTestsIds(loggedName, function (err, ids) {
        var testsQuantity = ids.length;
        var tests = [];
        for (var i = 0; i < testsQuantity; i++) {
            tests.push({ id: ids[i].testId });
        }
        res.render('statystykiOgolne', { tests: tests, csrftoken: req.csrfToken() });
    });
});
function sortAnswerArray(question1, question2) {
    if (question1.id > question2.id) {
        return 1;
    }
    else if (question1.id < question2.id) {
        return -1;
    }
    else {
        return 0;
    }
}
function sortBestScoresArr(score1, score2) {
    if (score1.totalScore > score2.totalScore) {
        return 1;
    }
    else if (score1.totalScore < score2.totalScore) {
        return -1;
    }
    else {
        return 0;
    }
}
function getThreeBest(rows) {
    rows.sort(sortBestScoresArr);
    var toPrint = Math.min(rows.length, 3);
    var toPrintArr = [];
    for (var i = 0; i < toPrint; i++) {
        toPrintArr.push(rows[i]);
    }
    return toPrintArr;
}
function makeMeanTimeArr(rows, questionNum) {
    var meanTime = new Array(questionNum);
    var meanTime2 = new Array(questionNum);
    var correctQuant = new Array(questionNum);
    for (var i = 0; i < questionNum; i++) {
        meanTime[i] = 0;
        correctQuant[i] = 0;
    }
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].isCorrect) {
            correctQuant[rows[i].questionId - 1]++;
            meanTime[rows[i].questionId - 1] += rows[i].time;
        }
    }
    for (var i = 0; i < questionNum; i++) {
        if (correctQuant[i] > 0) {
            meanTime[i] /= correctQuant[i];
        }
        else {
            meanTime[i] = 0;
        }
    }
    for (var i = 0; i < questionNum; i++) {
        meanTime2[i] = { id: i + 1, meanTime: meanTime[i].toFixed(2) };
    }
    return meanTime2;
}
app.get('/test/:testId', csrfProtection, function (req, res) {
    var testId = Number(req.params.testId);
    db.getTestDataForAll(testId, function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            var answers_2 = [];
            var meanTime_1;
            var usernamesSet = new Set();
            rows.sort(sortAnswerArray);
            for (var i = 0; i < rows.length; i++) {
                usernamesSet.add(rows[i].username);
                if (rows[i].username === loggedName) {
                    var row = rows[i];
                    if (row.isCorrect) {
                        answers_2.push({ id: row.questionId, text: row.answer, czyPoprawna: "poprawna" });
                    }
                    else {
                        answers_2.push({ id: row.questionId, text: row.answer, czyPoprawna: "niepoprawna" });
                    }
                }
            }
            var usernameSize = usernamesSet.size;
            meanTime_1 = makeMeanTimeArr(rows, rows.length / usernameSize);
            db.getTest(testId, function (err, correctTest) {
                if (err) {
                    throw err;
                }
                else {
                    var correctAnswers_1 = [];
                    var correctTestArr = JSON.parse(correctTest).questions;
                    for (var i = 0; i < correctTestArr.length; i++) {
                        correctAnswers_1.push({ id: correctTestArr[i].number, text: correctTestArr[i].correct_answer });
                    }
                    db.getTotalScore(testId, function (err, totalScores) {
                        if (err) {
                            throw err;
                        }
                        else {
                            answers_2.sort(sortAnswerArray);
                            var scoreArr = getThreeBest(totalScores);
                            res.render('daneTestu', { testId: testId, login: loggedName, answers: answers_2, correctAnswers: correctAnswers_1, scores: scoreArr,
                                meanTimes: meanTime_1, csrftoken: req.csrfToken() });
                        }
                    });
                }
            });
        }
    });
});
app.listen(3000, function () { return console.log('Listening on port 3000.'); });
