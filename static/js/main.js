// let jsonString: string = `{
//     "questions": [
//         {
//           "number": 1,
//           "question": "Ile wynosi 2 + 2 * 2",
//           "correct_answer": "6",
//           "penalty": 2
//         },
//         {
//           "number": 2,
//           "question": "Nastepny wyraz ciagu 1, 4, 16, 64",
//           "correct_answer": "256",
//           "penalty": 4
//         },
//         {
//           "number": 2,
//           "question": "Ile wynosi 5!",
//           "correct_answer": "120",
//           "penalty": 6
//         },
//         {
//           "number": 2,
//           "question": "Na ile sposobow mozna wybrac podzbiory 2-elementowe ze zbioru 5 elementowego",
//           "correct_answer": "10",
//           "penalty": 7
//         }
//       ]
//     }`;
// //Interfejs reprezentujacy zadanie
// interface singleTask {
//         number: number;
//         question: string;
//         correct_answer: string;
//         penalty: number;
//     }
// //interface reprezentujacy zadania
// interface TaskTable {
//     questions: singleTask[];
// }
// //sprawdzam poprawnosc danych
// function sprawdzDane(dane: any): dane is TaskTable {
//     if (dane.questions) {
//          return true;
//     } else {
//         return false;
//     }
// }
// //parsuje pytania ze stringu
// let zadanie: TaskTable = JSON.parse(jsonString);
// if (sprawdzDane(zadanie)) {
//     let juznapewno = zadanie;
// }
// const anulujPrzycisk = document.getElementsByClassName("button").item(0) as HTMLFormElement;
// const zakonczPrzycisk = document.getElementsByClassName("button").item(1) as HTMLFormElement;
// const poprzedniPrzycisk = document.getElementsByClassName("button").item(2) as HTMLFormElement;
// const nastepnyPrzycisk = document.getElementsByClassName("button").item(3) as HTMLFormElement;
// const poletekstowe = document.getElementById("text_odp") as HTMLInputElement;
// const startPrzycisk = document.getElementById("start_btn") as HTMLInputElement;
// const startDiv = document.getElementById("start_div") as HTMLHtmlElement;
// const wynikiDiv = document.getElementById("rezultat") as HTMLHtmlElement;
// const caleWyniki = document.getElementById("wyniki_div") as HTMLHtmlElement;
// const liczbapytan = zadanie.questions.length;
// const wynikBtn = document.getElementsByClassName("stat_btn").item(0) as HTMLFormElement;
// const wynikStatBtn = document.getElementsByClassName("stat_btn").item(1) as HTMLFormElement;
// const loginBtn = document.getElementById("logowanie") as HTMLInputElement;
// const registerBtn = document.getElementById("rejestracja") as HTMLInputElement;
// const logoutBtn = document.getElementById("wylogowanie") as HTMLInputElement;
// const staty = document.getElementById("stat");
// let ktoraProbaString = localStorage.getItem("ktoraProba");
// let czaswQuizie = 0;
// let czyOdpowiedziano: boolean[] = new Array(liczbapytan);
// let czasNaPytaniu: number[] = new Array(liczbapytan);
// let odpUzytkownika: string[] = new Array(liczbapytan);
// let biezacePytanie = 0;
// let ileWpisanychOdp = 0;
// let wynikCalk = 0;
// let wrapper = document.getElementById("wrapper") as HTMLHtmlElement;
// let ktoraProba;
// //jesli w local storage znajduje sie element opisujacy, ktora wykonujemy probe
// //to ja zapisuje
// //wpp zapisuje 0
// if (ktoraProbaString == null) {
//   ktoraProba = 0;
// } else {
//   ktoraProba = Number(ktoraProbaString);
// }
// //Ukrytwam niepotrzebne elementy
// wrapper.style.visibility = 'hidden';
// document.getElementById("liczbapytan").innerHTML = "Liczba pytan:" + liczbapytan.toString();
// zakonczPrzycisk.style.visibility = 'hidden';
// caleWyniki.style.visibility = 'hidden';
// let czy_mierzyc_czas = false;
// //zeruje odpowiedzi wpisane przez uzytkownika
// function wyzerujOdp() {
//   for (let i = 0; i < liczbapytan; i++) {
//     odpUzytkownika[i] = "";
//     czyOdpowiedziano[i] = false;
//   }
// }
// //zeruje pozostale zapisane dane
// function wyczyscDoNast() {
//   czy_mierzyc_czas = false;
//   biezacePytanie = 0;
//   czaswQuizie = 0;
//   ileWpisanychOdp = 0;
//   poletekstowe.value = "";
//   for (let i = 0; i < liczbapytan; i++) {
//     czasNaPytaniu[i] = 0;
//   }
// }
// //obsluguje klikniecie przycisku start
// startPrzycisk.addEventListener('click', function() {
//   wrapper.style.visibility = 'visible';
//   poprzedniPrzycisk.style.visibility = 'hidden';
//   nastepnyPrzycisk.style.visibility = 'visible';
//   zakonczPrzycisk.style.visibility = 'hidden';
//   startDiv.style.visibility = 'hidden';
//   wyswietlPytanie(zadanie.questions[0]);
//   wyzerujOdp();
//   wyczyscDoNast();
//   czy_mierzyc_czas = true;
// });
// //wyswietla czas, ktory uplynal
// setInterval(function() {
//   if (czy_mierzyc_czas) {
//     czaswQuizie++;
//     czasNaPytaniu[biezacePytanie]++;
//     document.getElementById("timer").innerHTML = "Uplynelo sekund: " + czaswQuizie.toString();
//   }
// }, 1000);
// //wyswietla dane do pytania
// function wyswietlPytanie(pytanie: singleTask) {
//   document.getElementById("question_text").innerHTML = pytanie.question;
//   document.getElementById("kara").innerHTML = "Kara wynosi (sekund):" + pytanie.penalty.toString();
//   document.getElementById("numerpytania").innerHTML = "Pytanie numer:" + pytanie.penalty.toString();
//   document.getElementById("numerpytania").innerHTML = "Pytanie numer:" + pytanie.number.toString();
// }
// //oblsuguje klikniecie przycisku nastepny
// nastepnyPrzycisk.addEventListener('click', function() {
//   biezacePytanie++;
//   wyswietlPytanie(zadanie.questions[biezacePytanie]);
//   let zapisanaOdp = odpUzytkownika[biezacePytanie];
//   if (zapisanaOdp != "") {
//     poletekstowe.value = zapisanaOdp;
//   } else {
//     poletekstowe.value = "";
//   }
//   poprzedniPrzycisk.style.visibility = 'visible';
//   if (biezacePytanie + 1 >= liczbapytan) {
//     nastepnyPrzycisk.style.visibility = 'hidden';
//   }
// });
// //oblsuguje klikniecie przycisku poprzedni
// poprzedniPrzycisk.addEventListener('click', function() {
//   biezacePytanie--;
//   wyswietlPytanie(zadanie.questions[biezacePytanie]);
//   let zapisanaOdp = odpUzytkownika[biezacePytanie];
//   if (zapisanaOdp != null) {
//     poletekstowe.value = zapisanaOdp;
//   } else {
//     poletekstowe.value = "";
//   }
//   nastepnyPrzycisk.style.visibility = 'visible';
//   if (biezacePytanie == 0) {
//     poprzedniPrzycisk.style.visibility = 'hidden';
//   }
// });
// //oblsuguje wpisanie tekstu w pole
// poletekstowe.addEventListener('input', function() {
//   let wpisana_odp = poletekstowe.value;
//   if (wpisana_odp.length != 0) {
//     if (!czyOdpowiedziano[biezacePytanie]) {
//       czyOdpowiedziano[biezacePytanie] = true;
//       ileWpisanychOdp++;
//     }
//     odpUzytkownika[biezacePytanie] = wpisana_odp;
//   } else {
//     odpUzytkownika[biezacePytanie] = "";
//     if (czyOdpowiedziano[biezacePytanie]) {
//       czyOdpowiedziano[biezacePytanie] = false;
//       ileWpisanychOdp--;
//     }
//     if (zakonczPrzycisk.style.visibility == 'visible') {
//       zakonczPrzycisk.style.visibility = 'hidden';
//     }
//   }
//   if (ileWpisanychOdp == zadanie.questions.length) {
//     zakonczPrzycisk.style.visibility = 'visible';
//   }
// });
// //wyswietla wyniki
// function wyswietlWyniki(punktacja: number, odpUzytkownika: string[]) {
//   //ukrywam niepotrzebne elementy
//   wrapper.style.visibility = 'hidden';
//   poprzedniPrzycisk.style.visibility = 'hidden';
//   nastepnyPrzycisk.style.visibility = 'hidden';
//   zakonczPrzycisk.style.visibility = 'hidden';
//   caleWyniki.style.visibility = 'visible';
//   //dodaje informacje o rezultacie
//   let twojwynikArt = document.createElement("article");
//   let twojwynikTxt = document.createTextNode("Twoj wynik to: " + punktacja.toString());
//   twojwynikArt.appendChild(twojwynikTxt);
//   wynikiDiv.appendChild(twojwynikArt);
//   //w petli wyswietlam informacje i kazdym pytaniu
//   for (let i = 0; i < liczbapytan; i++) {
//     let pytaniei = zadanie.questions[i];
//     let czy_poprawna = "niepoprawna";
//     if (pytaniei.correct_answer == odpUzytkownika[i]) {
//       czy_poprawna = "poprawna";
//     }
//     let wynikPytania = document.createElement("article");
//     let wynikTxt = document.createTextNode("Pytanie numer: " + (i+1).toString() + ", twoja odpowiedz to: " + odpUzytkownika[i].toString() + 
//     ", odpowiedz: " + czy_poprawna + ", kara za odpowiedz bledna: " + pytaniei.penalty.toString());
//     wynikPytania.appendChild(wynikTxt);
//     wynikiDiv.appendChild(wynikPytania);
//   }
// }
// //liczymy punkty za caly test
// function policzPunktacje(punktacja: number) {
//   for(var i = 0; i < liczbapytan; i++) {
//     let pyt = zadanie.questions[i];
//     if (odpUzytkownika[i] != pyt.correct_answer) {
//       punktacja += pyt.penalty;
//     }
//   }
//   return punktacja;
// }
// //oblsluguje klikniecie przycisku zakoncz
// zakonczPrzycisk.addEventListener('click', function() {
//   czy_mierzyc_czas = false;
//   let punktacja = czaswQuizie;
//   punktacja = policzPunktacje(punktacja);
//   wynikCalk = punktacja;
//   wyswietlWyniki(punktacja, odpUzytkownika);
//   wyzerujOdp();
// });
// //oblsluguje klikniecie przycisku anuluj
// anulujPrzycisk.addEventListener('click', function() {
//   wyczyscDoNast();
//   wyzerujOdp();
//   wrapper.style.visibility = 'hidden';
//   poprzedniPrzycisk.style.visibility = 'hidden';
//   nastepnyPrzycisk.style.visibility = 'hidden';
//   zakonczPrzycisk.style.visibility = 'hidden';
//   startDiv.style.visibility = 'visible';
// });
// //wyswietla trzy najlepsze wyniki
// function wyswietlTrzyNaj() {
//   staty.innerHTML = '';
//   let arrayNaj = [];
//   for (let i = 0; i < localStorage.length; i++){
//     if (localStorage.key(i).substring(0,4) == 'Calk') {
//         arrayNaj.push(Number(localStorage.getItem(localStorage.key(i))));
//     }
// }
//   arrayNaj.sort();
//   let ileWypisac = Math.min(arrayNaj.length, 3);
//   for (let i = 0; i < ileWypisac; i++) {
//     let nowyLi = document.createElement("li");                 
//     let textLi = document.createTextNode(arrayNaj[i]);         
//     nowyLi.appendChild(textLi);                              
//     staty.appendChild(nowyLi);
//   }
// }
// wyswietlTrzyNaj();
// //zapisuje w local sortage potrzebne informacje
// //wyswietla 3 najlepsze wyniki
// //zmienia numer proby
// function zapiszWynikiWysw() {
//   ktoraProba++;
//   localStorage.setItem("ktoraProba", ktoraProba.toString());
//   localStorage.setItem("Calk" + ktoraProba.toString(), wynikCalk.toString());
//   wynikCalk = 0;
//   caleWyniki.style.visibility = 'hidden';
//   startDiv.style.visibility = 'visible';
//   console.log(wynikiDiv.lastChild);
//   wynikiDiv.innerHTML = ''
//   wyswietlTrzyNaj();
// }
// //oblsuga przyciku, ktory zapisuje tylko calkowity wynik
// wynikBtn.addEventListener('click', function() {
//   zapiszWynikiWysw();
//   wyczyscDoNast();
// });
// //oblsuga przyciku, ktory zapisuje calkowity wynik i statystyki 
// wynikStatBtn.addEventListener('click', function() {
//   zapiszWynikiWysw();
//   for(let i = 0; i < liczbapytan; i++) {
//     localStorage.setItem("Stat_Pyt" + (i+1).toString() + "Uzyt" + ktoraProba.toString(), czasNaPytaniu[i].toString());
//   }
//   wyczyscDoNast();
// });
