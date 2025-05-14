const { Given, When, Then } = require('cucumber');
const assert = require('assert');
require('chromedriver');
const { By, Capabilities, Builder, until } = require('selenium-webdriver');

const capabilities = Capabilities.chrome();
capabilities.set('chromeoptions', { "w3c": false });

Given('User opens the web page', function () {
    this.driver = new Builder().withCapabilities(capabilities).build();
    this.driver.get('http://localhost:3000/');
    this.driver.manage().window().maximize();
});

When('User tries to login', async function () {
    await this.driver.findElement(By.css('.nav-btn-login.me-2')).click(); // Fixed selector
    const emailLocator = By.id('loginEmail');
    await this.driver.wait(until.elementLocated(emailLocator), 5000);
    const emailElement = await this.driver.findElement(emailLocator); // Fixed typo
    await this.driver.wait(until.elementIsVisible(emailElement), 5000);
    emailElement.sendKeys('cesar.mail@gmail.com');

    const passwordLocator = By.id('loginPassword');
    const pwdElement = await this.driver.findElement(passwordLocator);
    pwdElement.sendKeys('password');


     const button = await this.driver.wait(
        until.elementLocated(By.xpath('//*[@id="loginModal"]/div/div/form/div/button')),
        5000
    );
    await button.click();
});

Then('A continue pop up should be present', async function () {
    const successBtn = await this.driver.wait(
        until.elementLocated(By.xpath('/html/body/div[6]/div/div[6]/button[1]')),
        5000 
      );
      

      await this.driver.wait(until.elementIsVisible(successBtn), 5000);
      
      const isDisplayed = await successBtn.isDisplayed();
      assert.strictEqual(isDisplayed, true, "The success button is not visible");
    
})