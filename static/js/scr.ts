
const dodatkoweInfo = document.getElementById('infobledy') as HTMLFormElement;
const anulujPrzycisk = document.getElementsByClassName("button").item(0) as HTMLFormElement;
const zakonczPrzycisk = document.getElementsByClassName("button").item(1) as HTMLFormElement;
const poprzedniPrzycisk = document.getElementsByClassName("button").item(2) as HTMLFormElement;
const nastepnyPrzycisk = document.getElementsByClassName("button").item(3) as HTMLFormElement;
const poletekstowe = document.getElementById("text_odp") as HTMLInputElement;
const startPrzycisk = document.getElementById("start_btn") as HTMLInputElement;
const startDiv = document.getElementById("start_div") as HTMLHtmlElement;
const wynikiDiv = document.getElementById("rezultat") as HTMLHtmlElement;
const caleWyniki = document.getElementById("wyniki_div") as HTMLHtmlElement;
const wynikStatBtn = document.getElementsByClassName("stat_btn").item(0) as HTMLFormElement;
const staty = document.getElementById("stat");
const wrapper = document.getElementById("wrapper") as HTMLHtmlElement;
const selecttest = document.getElementById("wyborTestow") as HTMLFormElement;
wrapper.style.visibility = 'hidden';
zakonczPrzycisk.style.visibility = 'hidden';
caleWyniki.style.visibility = 'hidden';

//Interfejs reprezentujacy zadanie
interface singleTask {
    number: number;
    question: string;
    correct_answer: string;
    penalty: number;
}
//interface reprezentujacy zadania
interface TaskTable {
questions: singleTask[];
}

let wynikCalk = 0;
let liczbapytan;
let zadanie: TaskTable;
let odpUzytkownika: string[];
let czyOdpowiedziano: boolean[];
let czy_mierzyc_czas = false;
let biezacePytanie = 0;
let ileWpisanychOdp = 0;
let czaswQuizie = 0;
let czasNaPytaniu: number[];
let idTestu;

async function getTests() {
    
    const response = await fetch('getUndoneTests');
    const text = await response.text();
    if (text === "niezalogowany") {
        dodatkoweInfo.innerHTML = ''
        const textNode = document.createTextNode('Niezalogowani uzytkownicy nie moga rozpoczac testu');
        dodatkoweInfo.appendChild(textNode);
        return null;
    } else {
        return JSON.parse(text);
    }
   
}
setInterval(function() {
    if (czy_mierzyc_czas) {
      czaswQuizie++;
      czasNaPytaniu[biezacePytanie]++;
      document.getElementById("timer").innerHTML = "Uplynelo sekund: " + czaswQuizie.toString();
    }
  }, 1000);

function wyswietlPytanie(pytanie: singleTask) {
    document.getElementById("question_text").innerHTML = pytanie.question;
    document.getElementById("kara").innerHTML = "Kara wynosi (sekund):" + pytanie.penalty.toString();
    document.getElementById("numerpytania").innerHTML = "Pytanie numer:" + pytanie.penalty.toString();
    document.getElementById("numerpytania").innerHTML = "Pytanie numer:" + pytanie.number.toString();
}
//zeruje odpowiedzi wpisane przez uzytkownika
function wyzerujOdp() {
    for (let i = 0; i < liczbapytan; i++) {
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
    for (let i = 0; i < liczbapytan; i++) {
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

function inicjalizujGlobalne(length: number) {
    liczbapytan = length;
    odpUzytkownika = new Array(liczbapytan);
    czyOdpowiedziano = new Array(liczbapytan);
    czasNaPytaniu = new Array(liczbapytan);
}

function findTest(testId: number, testQuant: number, table) {
  for(let i = 0; i < testQuant; i++) {
    if (table[i].id == testId) {
      return table[i].test;
    }
  }
  return null;
}

startPrzycisk.addEventListener('click', function() {
     (async () => {
         let resp = await getTests();
         console.log(resp);
         if (resp !== null) {
             let chosenTestId = selecttest.options[selecttest.selectedIndex].value;
             let czyjestzadanie = findTest(chosenTestId, resp.tests.length, resp.tests);
             if (czyjestzadanie !== null) {
               zadanie = czyjestzadanie;
               idTestu = chosenTestId;
               inicjalizujGlobalne(zadanie.questions.length);
               handleStartButton();
             } else {
              dodatkoweInfo.innerHTML = ''
              const textNode = document.createTextNode('Juz wykonales ten test');
              dodatkoweInfo.appendChild(textNode);
             }
         }
     })();
});

 //oblsuguje klikniecie przycisku nastepny
nastepnyPrzycisk.addEventListener('click', function() {
      
    biezacePytanie++;
    wyswietlPytanie(zadanie.questions[biezacePytanie]);
    let zapisanaOdp = odpUzytkownika[biezacePytanie];
    if (zapisanaOdp != "") {
      poletekstowe.value = zapisanaOdp;
    } else {
      poletekstowe.value = "";
    }
    poprzedniPrzycisk.style.visibility = 'visible';
    if (biezacePytanie + 1 >= liczbapytan) {
      nastepnyPrzycisk.style.visibility = 'hidden';
    }
});

  //oblsuguje klikniecie przycisku poprzedni
poprzedniPrzycisk.addEventListener('click', function() {
      
    biezacePytanie--;
    wyswietlPytanie(zadanie.questions[biezacePytanie]);
    let zapisanaOdp = odpUzytkownika[biezacePytanie];
    if (zapisanaOdp != null) {
      poletekstowe.value = zapisanaOdp;
    } else {
      poletekstowe.value = "";
    }
    nastepnyPrzycisk.style.visibility = 'visible';
    if (biezacePytanie == 0) {
      poprzedniPrzycisk.style.visibility = 'hidden';
    }
});

  //oblsuguje wpisanie tekstu w pole
poletekstowe.addEventListener('input', function() {
    let wpisana_odp = poletekstowe.value;
    if (wpisana_odp.length != 0) {
      if (!czyOdpowiedziano[biezacePytanie]) {
        czyOdpowiedziano[biezacePytanie] = true;
        ileWpisanychOdp++;
      }
      odpUzytkownika[biezacePytanie] = wpisana_odp;
    } else {
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
function wyswietlWyniki(punktacja: number, odpUzytkownika: string[]) {
    //ukrywam niepotrzebne elementy
    wrapper.style.visibility = 'hidden';
    poprzedniPrzycisk.style.visibility = 'hidden';
    nastepnyPrzycisk.style.visibility = 'hidden';
    zakonczPrzycisk.style.visibility = 'hidden';
    caleWyniki.style.visibility = 'visible';
    //dodaje informacje o rezultacie
    let twojwynikArt = document.createElement("article");
    let twojwynikTxt = document.createTextNode("Twoj wynik to: " + punktacja.toString());
    twojwynikArt.appendChild(twojwynikTxt);
    wynikiDiv.appendChild(twojwynikArt);
    let procentCzasu = new Array(liczbapytan);
    let suma = 0;
    for(let i = 0; i < liczbapytan; i++) {
        suma += czasNaPytaniu[i];
    }
    for(let i = 1; i < liczbapytan + 1; i++) {
         procentCzasu[i - 1] = czasNaPytaniu[i - 1]/suma;
    }
    //w petli wyswietlam informacje i kazdym pytaniu
    for (let i = 0; i < liczbapytan; i++) {
      let pytaniei = zadanie.questions[i];
      let czy_poprawna = "niepoprawna";
      if (pytaniei.correct_answer == odpUzytkownika[i]) {
        czy_poprawna = "poprawna";
      }
      let wynikPytania = document.createElement("article");
      wynikPytania.setAttribute("id", "art" + (i + 1).toString());
      wynikPytania.setAttribute("class", "rezarticle");
      let wynikTxt = document.createTextNode("Pytanie numer: " + (i+1).toString() + ", twoja odpowiedz to: " + odpUzytkownika[i].toString() + 
      ", odpowiedz: " + czy_poprawna + ", kara za odpowiedz bledna: " + 
      pytaniei.penalty.toString() + ", procent czasu: " + ((procentCzasu[i] * 100).toFixed(2)).toString() + "%");
      
      wynikPytania.appendChild(wynikTxt);
      wynikiDiv.appendChild(wynikPytania);
    }
  }

  //liczymy punkty za caly test
  function policzPunktacje(punktacja: number) {
    for(var i = 0; i < liczbapytan; i++) {
      let pyt = zadanie.questions[i];
      if (odpUzytkownika[i] != pyt.correct_answer) {
        punktacja += pyt.penalty;
      }
    }
    return punktacja;
  }

  //oblsluguje klikniecie przycisku zakoncz
  zakonczPrzycisk.addEventListener('click', function() {

    fetch('/finishedTest');
    czy_mierzyc_czas = false;
    let punktacja = czaswQuizie;
    punktacja = policzPunktacje(punktacja);

    wynikCalk = punktacja;

    wyswietlWyniki(punktacja, odpUzytkownika);
    
  });

//oblsluguje klikniecie przycisku anuluj
anulujPrzycisk.addEventListener('click', function() {
    wyczyscDoNast();
    wyzerujOdp();
    wrapper.style.visibility = 'hidden';
    poprzedniPrzycisk.style.visibility = 'hidden';
    nastepnyPrzycisk.style.visibility = 'hidden';
    zakonczPrzycisk.style.visibility = 'hidden';
    startDiv.style.visibility = 'visible';
});


wynikStatBtn.addEventListener('click', function() {
    let daneDoSerwera = [];
    let suma = 0;
    for(let i = 0; i < liczbapytan; i++) {
        suma += czasNaPytaniu[i];
    }
    daneDoSerwera.push({testId: idTestu});
    for(let i = 1; i < liczbapytan + 1; i++) {
        let procent = czasNaPytaniu[i - 1]/suma;
        daneDoSerwera.push({questionPercent: i, percent: procent});
    }
    for(let i = 0; i < liczbapytan; i++) {
      daneDoSerwera.push({questionAnswer: i+1, answer: odpUzytkownika[i]});
    }
    const options = {
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

