import { assert } from "console";

const {Builder, By, Key, until} = require('selenium-webdriver');

async function testWylogowywania() {
    let driver = await new Builder().forBrowser("firefox").build();
    await driver.get("http://127.0.0.1:3000");
    await driver.get("http://127.0.0.1:3000/logowanie");
    driver.findElement(By.id("username")).sendKeys("user1");
    await driver.findElement(By.id("password")).sendKeys("user1");
    await driver.findElement(By.id("loginBtn")).click();
    let cookies = await driver.manage().getCookies();
    await driver.manage().deleteAllCookies();
    let driver2 = await new Builder().forBrowser("firefox").build();
    await driver2.get("http://127.0.0.1:3000");
    await driver2.get("http://127.0.0.1:3000/zmiana_hasla");
    await driver2.findElement(By.name("password")).sendKeys("user1");
    await driver2.findElement(By.id("zmien_haslo")).click();
    for (let i = 0; i < cookies.length; i++) {
        await driver2.manage().addCookie(cookies[i]);
    }
    await driver2.findElement(By.id("start_btn")).click();
    let infoBledy = await driver2.findElement(By.id("infobledy")).getText();
    assert(infoBledy === "Niezalogowani uzytkownicy nie moga rozpoczac testu");
    driver.close();
    driver2.close();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testWysylaniaDanych() {
    let driver = await new Builder().forBrowser("firefox").build();
    await driver.get("http://127.0.0.1:3000");
    await driver.get("http://127.0.0.1:3000/logowanie");
    driver.findElement(By.id("username")).sendKeys("user2");
    await driver.findElement(By.id("password")).sendKeys("user2");
    await driver.findElement(By.id("loginBtn")).click();
    await driver.findElement(By.id("start_btn")).click();
    for (let i = 0; i < 3; i++) {
        await sleep(2000);
        driver.findElement(By.id("text_odp")).sendKeys("1");
        driver.findElement(By.id("nastBtn")).click();
    }
    await sleep(2000);
    driver.findElement(By.id("text_odp")).sendKeys("1");
    await driver.findElement(By.id("stopBtn")).click();
    for (let i = 0; i < 4; i++) {
        let a = await driver.findElement(By.id("art" + (i + 1).toString())).getText();
        let alen = a.length - 2;
        let b = []
        while(a[alen] != ' ') {
            b.push(a[alen]);
            alen--;
        }
        b.reverse();
        assert("2,5,.,0,0" === b.join());
    }
    driver.close();
    
}

async function testDwukrotneWykonanieTestu() {
    let driver = await new Builder().forBrowser("firefox").build();
    await driver.get("http://127.0.0.1:3000");
    await driver.get("http://127.0.0.1:3000/logowanie");
    driver.findElement(By.id("username")).sendKeys("user2");
    await driver.findElement(By.id("password")).sendKeys("user2");
    await driver.findElement(By.id("loginBtn")).click();
   
    await driver.findElement(By.id("start_btn")).click();
    for (let i = 0; i < 3; i++) {
        await driver.findElement(By.id("text_odp")).sendKeys("1");
        await driver.findElement(By.id("nastBtn")).click();
       
    }
    await driver.findElement(By.id("text_odp")).sendKeys("1");
    await driver.findElement(By.id("stopBtn")).click();
    await driver.findElement(By.className("stat_btn")).click();
    await driver.findElement(By.id("start_btn")).click();
    let infoBledy = await driver.findElement(By.id("infobledy")).getText();
    assert(infoBledy === "Juz wykonales ten test");
    driver.close();
}
(async () => {
    await testWylogowywania();
    await testWysylaniaDanych();
    await testDwukrotneWykonanieTestu();
})();
