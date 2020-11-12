"use strict";
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
exports.__esModule = true;
var console_1 = require("console");
var _a = require('selenium-webdriver'), Builder = _a.Builder, By = _a.By, Key = _a.Key, until = _a.until;
function testWylogowywania() {
    return __awaiter(this, void 0, void 0, function () {
        var driver, cookies, driver2, i, infoBledy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Builder().forBrowser("firefox").build()];
                case 1:
                    driver = _a.sent();
                    return [4 /*yield*/, driver.get("http://127.0.0.1:3000")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.get("http://127.0.0.1:3000/logowanie")];
                case 3:
                    _a.sent();
                    driver.findElement(By.id("username")).sendKeys("user1");
                    return [4 /*yield*/, driver.findElement(By.id("password")).sendKeys("user1")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("loginBtn")).click()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, driver.manage().getCookies()];
                case 6:
                    cookies = _a.sent();
                    return [4 /*yield*/, driver.manage().deleteAllCookies()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, new Builder().forBrowser("firefox").build()];
                case 8:
                    driver2 = _a.sent();
                    return [4 /*yield*/, driver2.get("http://127.0.0.1:3000")];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, driver2.get("http://127.0.0.1:3000/zmiana_hasla")];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, driver2.findElement(By.name("password")).sendKeys("user1")];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, driver2.findElement(By.id("zmien_haslo")).click()];
                case 12:
                    _a.sent();
                    i = 0;
                    _a.label = 13;
                case 13:
                    if (!(i < cookies.length)) return [3 /*break*/, 16];
                    return [4 /*yield*/, driver2.manage().addCookie(cookies[i])];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 13];
                case 16: return [4 /*yield*/, driver2.findElement(By.id("start_btn")).click()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, driver2.findElement(By.id("infobledy")).getText()];
                case 18:
                    infoBledy = _a.sent();
                    console_1.assert(infoBledy === "Niezalogowani uzytkownicy nie moga rozpoczac testu");
                    driver.close();
                    driver2.close();
                    return [2 /*return*/];
            }
        });
    });
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function testWysylaniaDanych() {
    return __awaiter(this, void 0, void 0, function () {
        var driver, i, i, a, alen, b;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Builder().forBrowser("firefox").build()];
                case 1:
                    driver = _a.sent();
                    return [4 /*yield*/, driver.get("http://127.0.0.1:3000")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.get("http://127.0.0.1:3000/logowanie")];
                case 3:
                    _a.sent();
                    driver.findElement(By.id("username")).sendKeys("user2");
                    return [4 /*yield*/, driver.findElement(By.id("password")).sendKeys("user2")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("loginBtn")).click()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("start_btn")).click()];
                case 6:
                    _a.sent();
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < 3)) return [3 /*break*/, 10];
                    return [4 /*yield*/, sleep(2000)];
                case 8:
                    _a.sent();
                    driver.findElement(By.id("text_odp")).sendKeys("1");
                    driver.findElement(By.id("nastBtn")).click();
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, sleep(2000)];
                case 11:
                    _a.sent();
                    driver.findElement(By.id("text_odp")).sendKeys("1");
                    return [4 /*yield*/, driver.findElement(By.id("stopBtn")).click()];
                case 12:
                    _a.sent();
                    i = 0;
                    _a.label = 13;
                case 13:
                    if (!(i < 4)) return [3 /*break*/, 16];
                    return [4 /*yield*/, driver.findElement(By.id("art" + (i + 1).toString())).getText()];
                case 14:
                    a = _a.sent();
                    alen = a.length - 2;
                    b = [];
                    while (a[alen] != ' ') {
                        b.push(a[alen]);
                        alen--;
                    }
                    b.reverse();
                    console_1.assert("2,5,.,0,0" === b.join());
                    _a.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 13];
                case 16:
                    driver.close();
                    return [2 /*return*/];
            }
        });
    });
}
function testDwukrotneWykonanieTestu() {
    return __awaiter(this, void 0, void 0, function () {
        var driver, i, infoBledy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Builder().forBrowser("firefox").build()];
                case 1:
                    driver = _a.sent();
                    return [4 /*yield*/, driver.get("http://127.0.0.1:3000")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.get("http://127.0.0.1:3000/logowanie")];
                case 3:
                    _a.sent();
                    driver.findElement(By.id("username")).sendKeys("user2");
                    return [4 /*yield*/, driver.findElement(By.id("password")).sendKeys("user2")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("loginBtn")).click()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("start_btn")).click()];
                case 6:
                    _a.sent();
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < 3)) return [3 /*break*/, 11];
                    return [4 /*yield*/, driver.findElement(By.id("text_odp")).sendKeys("1")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("nastBtn")).click()];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 7];
                case 11: return [4 /*yield*/, driver.findElement(By.id("text_odp")).sendKeys("1")];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("stopBtn")).click()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.className("stat_btn")).click()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("start_btn")).click()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(By.id("infobledy")).getText()];
                case 16:
                    infoBledy = _a.sent();
                    console_1.assert(infoBledy === "Juz wykonales ten test");
                    driver.close();
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, testWylogowywania()];
            case 1:
                _a.sent();
                return [4 /*yield*/, testWysylaniaDanych()];
            case 2:
                _a.sent();
                return [4 /*yield*/, testDwukrotneWykonanieTestu()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
