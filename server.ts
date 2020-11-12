const csrf = require('csurf')
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');
const multer = require('multer');
const session = require('express-session');
const fs = require('fs');
const db = require('./database');
const testsNumber = 2;

const app = express()
let upload = multer({ dest: 'tmp' });

app.set('trust proxy', 1);
app.use(session({
  secret: 'totally secret',
  resave: false,
  saveUninitialized: true,
}));
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({}));
let csrfProtection = csrf({});


let islogged = false;
let loggedName;
let timeOnQuiz = 0;
let measure_time = false;
setInterval(function() {
  if (measure_time) {
    timeOnQuiz++;
  }
}, 1000);


app.get('/', csrfProtection, (req, res) => {
     let tests = []
     for(let i = 0; i < testsNumber; i++) {
       tests.push({id: i+1});
     }
     res.render('index', {logged_in: islogged, tests: tests, csrftoken: req.csrfToken()});
});

app.get('/logowanie', csrfProtection, (req, res) => {
  if (req.session.user) {
     res.redirect('/');
  } else {
      res.render('logowanie', {warning: false, csrftoken: req.csrfToken()});
  }
});

app.post('/logowanie', csrfProtection, (req, res) => {
  if (req.session.user) {
      res.status(405).send();
  } else {
      let name = req.body.username;
      let input_password_hash = md5(req.body.password);
      db.getPasswordHash(name, (err, db_password_hash) => {
          if (err) {
              throw err;
          } else if (db_password_hash && input_password_hash === db_password_hash) {
              req.session.user = name;
              islogged = true; 
              loggedName = req.body.username;
              res.redirect('/');
          } else {
              res.render('logowanie', {warning: true, csrftoken: req.csrfToken()});
          }
      });
  }
});

app.get('/rejestracja', csrfProtection, (req, res) => {
  if (req.session.user) {
      res.redirect('/');
  } else {
      res.render('rejestracja', {csrftoken: req.csrfToken()});
  }
});

app.post('/rejestracja', csrfProtection, (req, res) => {
  let name: string = req.body.username;
  let password_hash: string = md5(req.body.password);
  db.getUsernames((err, usernames) => {
      if (err) {
          throw err;
      } else if (!usernames || usernames.includes(name)) {
          res.render('rejestracja', {info: "Użytkownik o tej nazwie już istnieje.",
                                  csrftoken: req.csrfToken()});
      } else {
          db.insertUser(name, password_hash);
          req.session.user = name;
          islogged = true; 
          loggedName = name;
          res.redirect('/');
      }
  });
});

app.post('/wylogowanie', (req, res) => {
  req.session.user = null;
  islogged = false;
  loggedName = null;
  res.redirect('/');
});

app.get('/zmiana_hasla', csrfProtection, (req, res) => {
  res.render('zmiana_hasla', {csrftoken: req.csrfToken()});
});

app.post('/zmiana_hasla', csrfProtection, (req, res) => {
  let newpassword = req.body.password;
  db.changePassword(loggedName, md5(newpassword) ,(err) => {
    if (err) {
      throw err;
    } else {
        req.session.user = null;
        islogged = false;
        loggedName = null;
        res.redirect('/');
      }
    });
});

app.get('/finishedTest', (req, res) => {
  measure_time = false;
});
async function updateDatabase(testId, questionQuantity, timeOnQuestions, answers, answersCorrect, totalScore) {
   db.insertDoneTest(loggedName, testId);
   for (let i = 0; i < questionQuantity; i++) {
     db.insertTestData(loggedName, testId, i+1, timeOnQuestions[i], answers[i], answersCorrect[i]);
   }
   db.insertTotalScore(loggedName, testId, totalScore);
   
}
app.post('/getQuizData', (req, res) => {
  let dataArr = req.body;
  let dataArrLen = dataArr.length;
  let testId = dataArr[0].testId;
  db.getTest(testId, (err, test) => {
    if (err) {
      throw err;
    } else if (test) {
      let testJson = JSON.parse(test).questions;
      let totalScore = timeOnQuiz;
      let timeOnQuiz2 = timeOnQuiz;
      timeOnQuiz = 0;
      let questionQuantity = (dataArrLen - 1)/2;
      let timeOnQuestions = new Array(questionQuantity);
      let answers = new Array(questionQuantity);
      let answersCorrect = new Array(questionQuantity);
      for (let i = 1; i < dataArrLen; i++) {
        if (dataArr[i].questionPercent) {
          timeOnQuestions[dataArr[i].questionPercent - 1] = dataArr[i].percent * timeOnQuiz2;
        } else if (dataArr[i].questionAnswer) {
          answers[dataArr[i].questionAnswer - 1] = dataArr[i].answer;
          if (testJson[dataArr[i].questionAnswer - 1].correct_answer === dataArr[i].answer) {
            answersCorrect[dataArr[i].questionAnswer - 1] = 1;
          } else {
            answersCorrect[dataArr[i].questionAnswer - 1] = 0;
            totalScore += testJson[dataArr[i].questionAnswer - 1].penalty;
          }
        }
      }
      (async () => {
        await updateDatabase(testId, questionQuantity, timeOnQuestions, answers, answersCorrect, totalScore);
      })();
    } else {
      console.log("BLAD");
    }
  }); 

});

app.get('/getUndoneTests', (req, res) => {
  if (islogged) {
    db.getUndoneTests(loggedName, (err, tests) => {
      if (err) {
        throw err;
      } else {
        res.send({tests: tests, total: testsNumber});
      }
    });
    timeOnQuiz = 0;
    measure_time = true;
  } else {
    res.send("niezalogowany");
  }
  
});

app.get('/zobaczstaty', csrfProtection, (req, res) => {
  db.getDoneTestsIds(loggedName, (err, ids) => {
    let testsQuantity = ids.length;
    let tests = [];
    for (let i = 0; i < testsQuantity; i++) {
      tests.push({id: ids[i].testId});
    }
    res.render('statystykiOgolne', {tests: tests, csrftoken: req.csrfToken()});
  })
  
});

function sortAnswerArray(question1, question2) {
  if (question1.id > question2.id) {
    return 1;
  } else if (question1.id < question2.id) {
    return -1;
  } else {
    return 0;
  }
}
function sortBestScoresArr(score1, score2) {
  if (score1.totalScore > score2.totalScore) {
    return 1;
  } else if (score1.totalScore < score2.totalScore) {
    return -1;
  } else {
    return 0;
  }
}

function getThreeBest(rows) {
  rows.sort(sortBestScoresArr);
  let toPrint = Math.min(rows.length, 3);
  let toPrintArr = [];
  for (let i = 0; i < toPrint; i++) {
    toPrintArr.push(rows[i]);
  }
  return toPrintArr;
}

function makeMeanTimeArr(rows, questionNum) {
  let meanTime = new Array(questionNum);
  let meanTime2 = new Array(questionNum);
  let correctQuant = new Array(questionNum);
  for (let i = 0; i < questionNum; i++) {
    meanTime[i] = 0;
    correctQuant[i] = 0;
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].isCorrect) {
      correctQuant[rows[i].questionId - 1]++;
      meanTime[rows[i].questionId - 1] += rows[i].time;
    }
  }
  for (let i = 0; i < questionNum; i++) {
    if (correctQuant[i] > 0) {
      meanTime[i] /= correctQuant[i];
    } else {
      meanTime[i] = 0;
    }
  }
  for (let i = 0; i < questionNum; i++) {
    meanTime2[i] = {id: i + 1, meanTime: meanTime[i].toFixed(2)};
  }

  return meanTime2;
}

app.get('/test/:testId', csrfProtection, (req, res) => {
  let testId = Number(req.params.testId);
  db.getTestDataForAll(testId, (err, rows) => {
    if (err) {
      throw err;
    } else {
      let answers = [];
      let meanTime;
      let usernamesSet = new Set();
      rows.sort(sortAnswerArray);
      for(let i = 0; i < rows.length; i++) {
        usernamesSet.add(rows[i].username);
        
        if (rows[i].username === loggedName) {
          let row = rows[i];
          if (row.isCorrect) {
           answers.push({id: row.questionId, text: row.answer, czyPoprawna: "poprawna"});
          } else {
            answers.push({id: row.questionId, text: row.answer, czyPoprawna: "niepoprawna"});
          }
        }
      }
      let usernameSize = usernamesSet.size;
      meanTime = makeMeanTimeArr(rows, rows.length/usernameSize);
      db.getTest(testId, (err, correctTest) => {
        if (err) {
          throw err;
        } else {
          let correctAnswers = [];
          let correctTestArr = JSON.parse(correctTest).questions;
          for(let i = 0; i < correctTestArr.length; i++) {
            correctAnswers.push({id: correctTestArr[i].number, text: correctTestArr[i].correct_answer});
          }
          db.getTotalScore(testId, (err, totalScores) => {
            if (err) {
              throw err;
            } else {
              answers.sort(sortAnswerArray);
              let scoreArr = getThreeBest(totalScores);
              res.render('daneTestu', {testId: testId, login: loggedName, answers: answers, correctAnswers: correctAnswers, scores: scoreArr, 
                meanTimes: meanTime, csrftoken: req.csrfToken()});
            }
          });
        }
      })
    }
  });
});

app.listen(3000, () => console.log('Listening on port 3000.'));