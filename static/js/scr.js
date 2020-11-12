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
var dodatkoweInfo = document.getElementById('infobledy');
var anulujPrzycisk = document.getElementsByClassName("button").item(0);
var zakonczPrzycisk = document.getElementsByClassName("button").item(1);
var poprzedniPrzycisk = document.getElementsByClassName("button").item(2);
var nastepnyPrzycisk = document.getElementsByClassName("button").item(3);
var poletekstowe = document.getElementById("text_odp");
var startPrzycisk = document.getElementById("start_btn");
var startDiv = document.getElementById("start_div");
var wynikiDiv = document.getElementById("rezultat");
var caleWyniki = document.getElementById("wyniki_div");
var wynikStatBtn = document.getElementsByClassName("stat_btn").item(0);
var staty = document.getElementById("stat");
var wrapper = document.getElementById("wrapper");
var selecttest = document.getElementById("wyborTestow");
wrapper.style.visibility = 'hidden';
zakonczPrzycisk.style.visibility = 'hidden';
caleWyniki.style.visibility = 'hidden';
var wynikCalk = 0;
var liczbapytan;
var zadanie;
var odpUzytkownika;
var czyOdpowiedziano;
var czy_mierzyc_czas = false;
var biezacePytanie = 0;
var ileWpisanychOdp = 0;
var czaswQuizie = 0;
var czasNaPytaniu;
var idTestu;
function getTests() {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, textNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('getUndoneTests')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    if (text === "niezalogowany") {
                        dodatkoweInfo.innerHTML = '';
                        textNode = document.createTextNode('Niezalogowani uzytkownicy nie moga rozpoczac testu');
                        dodatkoweInfo.appendChild(textNode);
                        return [2 /*return*/, null];
                    }
                    else {
                        return [2 /*return*/, JSON.parse(text)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
setInterval(function () {
    if (czy_mierzyc_czas) {
        czaswQuizie++;
        czasNaPytaniu[biezacePytanie]++;
        document.getElementById("timer").innerHTML = "Uplynelo sekund: " + czaswQuizie.toString();
    }
}, 1000);
function wyswietlPytanie(pytanie) {
    document.getElementById("question_text").innerHTML = pytanie.question;
    document.getElementById("kara").innerHTML = "Kara wynosi (sekund):" + pytanie.penalty.toString();
    document.getElementById("numerpytania").innerHTML = "Pytanie numer:" + pytanie.penalty.toString();
    document.getElementById("numerpytania").innerHTML = "Pytanie numer:" + pytanie.number.toString();
}
//zeruje odpowiedzi wpisane przez uzytkownika
function wyzerujOdp() {
    for (var i = 0; i < liczbapytan; i++) {
        odpUzytkownika[i] = "";
        czyOdpowiedziano[i] = false;
    }
}
function wyczyscDoNast() {
    czy_mierzyc_czas = false;
    biezacePytanie = 0;
    czaswQuizie = 0;
    ileWpisanychOdp = 0;
    poletekstowe.value = "";
    for (var i = 0; i < liczbapytan; i++) {
        czasNaPytaniu[i] = 0;
    }
}
function handleStartButton() {
    wrapper.style.visibility = 'visible';
    poprzedniPrzycisk.style.visibility = 'hidden';
    nastepnyPrzycisk.style.visibility = 'visible';
    zakonczPrzycisk.style.visibility = 'hidden';
    startDiv.style.visibility = 'hidden';
    wyswietlPytanie(zadanie.questions[0]);
    wyzerujOdp();
    wyczyscDoNast();
    czy_mierzyc_czas = true;
}
function inicjalizujGlobalne(length) {
    liczbapytan = length;
    odpUzytkownika = new Array(liczbapytan);
    czyOdpowiedziano = new Array(liczbapytan);
    czasNaPytaniu = new Array(liczbapytan);
}
function findTest(testId, testQuant, table) {
    for (var i = 0; i < testQuant; i++) {
        if (table[i].id == testId) {
            return table[i].test;
        }
    }
    return null;
}
startPrzycisk.addEventListener('click', function () {
    var _this = this;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var resp, chosenTestId, czyjestzadanie, textNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTests()];
                case 1:
                    resp = _a.sent();
                    console.log(resp);
                    if (resp !== null) {
                        chosenTestId = selecttest.options[selecttest.selectedIndex].value;
                        czyjestzadanie = findTest(chosenTestId, resp.tests.length, resp.tests);
                        if (czyjestzadanie !== null) {
                            zadanie = czyjestzadanie;
                            idTestu = chosenTestId;
                            inicjalizujGlobalne(zadanie.questions.length);
                            handleStartButton();
                        }
                        else {
                            dodatkoweInfo.innerHTML = '';
                            textNode = document.createTextNode('Juz wykonales ten test');
                            dodatkoweInfo.appendChild(textNode);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); })();
});
//oblsuguje klikniecie przycisku nastepny
nastepnyPrzycisk.addEventListener('click', function () {
    biezacePytanie++;
    wyswietlPytanie(zadanie.questions[biezacePytanie]);
    var zapisanaOdp = odpUzytkownika[biezacePytanie];
    if (zapisanaOdp != "") {
        poletekstowe.value = zapisanaOdp;
    }
    else {
        poletekstowe.value = "";
    }
    poprzedniPrzycisk.style.visibility = 'visible';
    if (biezacePytanie + 1 >= liczbapytan) {
        nastepnyPrzycisk.style.visibility = 'hidden';
    }
});
//oblsuguje klikniecie przycisku poprzedni
poprzedniPrzycisk.addEventListener('click', function () {
    biezacePytanie--;
    wyswietlPytanie(zadanie.questions[biezacePytanie]);
    var zapisanaOdp = odpUzytkownika[biezacePytanie];
    if (zapisanaOdp != null) {
        poletekstowe.value = zapisanaOdp;
    }
    else {
        poletekstowe.value = "";
    }
    nastepnyPrzycisk.style.visibility = 'visible';
    if (biezacePytanie == 0) {
        poprzedniPrzycisk.style.visibility = 'hidden';
    }
});
//oblsuguje wpisanie tekstu w pole
poletekstowe.addEventListener('input', function () {
    var wpisana_odp = poletekstowe.value;
    if (wpisana_odp.length != 0) {
        if (!czyOdpowiedziano[biezacePytanie]) {
            czyOdpowiedziano[biezacePytanie] = true;
            ileWpisanychOdp++;
        }
        odpUzytkownika[biezacePytanie] = wpisana_odp;
    }
    else {
        odpUzytkownika[biezacePytanie] = "";
        if (czyOdpowiedziano[biezacePytanie]) {
            czyOdpowiedziano[biezacePytanie] = false;
            ileWpisanychOdp--;
        }
        if (zakonczPrzycisk.style.visibility == 'visible') {
            zakonczPrzycisk.style.visibility = 'hidden';
        }
    }
    if (ileWpisanychOdp == zadanie.questions.length) {
        zakonczPrzycisk.style.visibility = 'visible';
    }
});
//wyswietla wyniki
function wyswietlWyniki(punktacja, odpUzytkownika) {
    //ukrywam niepotrzebne elementy
    wrapper.style.visibility = 'hidden';
    poprzedniPrzycisk.style.visibility = 'hidden';
    nastepnyPrzycisk.style.visibility = 'hidden';
    zakonczPrzycisk.style.visibility = 'hidden';
    caleWyniki.style.visibility = 'visible';
    //dodaje informacje o rezultacie
    var twojwynikArt = document.createElement("article");
    var twojwynikTxt = document.createTextNode("Twoj wynik to: " + punktacja.toString());
    twojwynikArt.appendChild(twojwynikTxt);
    wynikiDiv.appendChild(twojwynikArt);
    var procentCzasu = new Array(liczbapytan);
    var suma = 0;
    for (var i = 0; i < liczbapytan; i++) {
        suma += czasNaPytaniu[i];
    }
    for (var i = 1; i < liczbapytan + 1; i++) {
        procentCzasu[i - 1] = czasNaPytaniu[i - 1] / suma;
    }
    //w petli wyswietlam informacje i kazdym pytaniu
    for (var i = 0; i < liczbapytan; i++) {
        var pytaniei = zadanie.questions[i];
        var czy_poprawna = "niepoprawna";
        if (pytaniei.correct_answer == odpUzytkownika[i]) {
            czy_poprawna = "poprawna";
        }
        var wynikPytania = document.createElement("article");
        wynikPytania.setAttribute("id", "art" + (i + 1).toString());
        wynikPytania.setAttribute("class", "rezarticle");
        var wynikTxt = document.createTextNode("Pytanie numer: " + (i + 1).toString() + ", twoja odpowiedz to: " + odpUzytkownika[i].toString() +
            ", odpowiedz: " + czy_poprawna + ", kara za odpowiedz bledna: " +
            pytaniei.penalty.toString() + ", procent czasu: " + ((procentCzasu[i] * 100).toFixed(2)).toString() + "%");
        wynikPytania.appendChild(wynikTxt);
        wynikiDiv.appendChild(wynikPytania);
    }
}
//liczymy punkty za caly test
function policzPunktacje(punktacja) {
    for (var i = 0; i < liczbapytan; i++) {
        var pyt = zadanie.questions[i];
        if (odpUzytkownika[i] != pyt.correct_answer) {
            punktacja += pyt.penalty;
        }
    }
    return punktacja;
}
//oblsluguje klikniecie przycisku zakoncz
zakonczPrzycisk.addEventListener('click', function () {
    fetch('/finishedTest');
    czy_mierzyc_czas = false;
    var punktacja = czaswQuizie;
    punktacja = policzPunktacje(punktacja);
    wynikCalk = punktacja;
    wyswietlWyniki(punktacja, odpUzytkownika);
});
//oblsluguje klikniecie przycisku anuluj
anulujPrzycisk.addEventListener('click', function () {
    wyczyscDoNast();
    wyzerujOdp();
    wrapper.style.visibility = 'hidden';
    poprzedniPrzycisk.style.visibility = 'hidden';
    nastepnyPrzycisk.style.visibility = 'hidden';
    zakonczPrzycisk.style.visibility = 'hidden';
    startDiv.style.visibility = 'visible';
});
wynikStatBtn.addEventListener('click', function () {
    var daneDoSerwera = [];
    var suma = 0;
    for (var i = 0; i < liczbapytan; i++) {
        suma += czasNaPytaniu[i];
    }
    daneDoSerwera.push({ testId: idTestu });
    for (var i = 1; i < liczbapytan + 1; i++) {
        var procent = czasNaPytaniu[i - 1] / suma;
        daneDoSerwera.push({ questionPercent: i, percent: procent });
    }
    for (var i = 0; i < liczbapytan; i++) {
        daneDoSerwera.push({ questionAnswer: i + 1, answer: odpUzytkownika[i] });
    }
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(daneDoSerwera)
    };
    fetch('/getQuizData', options);
    caleWyniki.style.visibility = 'hidden';
    startDiv.style.visibility = 'visible';
    wynikiDiv.innerHTML = '';
    wyzerujOdp();
    wyczyscDoNast();
});
