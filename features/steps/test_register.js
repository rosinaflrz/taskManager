const {Given, When, Then} = require ('cucumber');
const assert = require('assert');
require('chromedriver');
const {By, builder, Capabilities, Builder, until, Key} = require('selenium-webdriver');
const capabilities = Capabilities.chrome();
capabilities.set('chromeoptions', {"w3c":false});

Given('User opens the web page', function (){
    this.driver = new Builder().withCapabilities(capabilities).build()
    this.driver.get('http://localhost:3000/');
    this.driver.manage().window().maximize();

});

When('User tries to register', async function(){
    this.driver.findElement(By.css('.nav-btn-register')).click();
    //let name = await this.driver.findElement(By.id('registerName'));
    const namelocator = By.id('registerName');
    await this.driver.wait(until.elementLocated(namelocator), 5000);
    const nameElement = await this.driver.findElement(namelocator);
    await this.driver.wait(until.elementIsVisible(nameElement), 5000);
    nameElement.sendKeys('test8');
    
    const emailLocator = By.id('registerEmail');
    const emailElement = await this.driver.findElement(emailLocator);
    emailElement.sendKeys('test8@email.com');
    
    const passwordLocator = By.id('registerPassword');
    const pwdElement = await this.driver.findElement(passwordLocator);
    pwdElement.sendKeys('testpassword');

    const confirmLocator = By.id('confirmPassword');
    const pwd2Element = await this.driver.findElement(confirmLocator);
    pwd2Element.sendKeys('testpassword');

    this.driver.findElement(By.id('terms')).click();
    const button = await this.driver.wait(
        until.elementLocated(By.xpath('//*[@id="registerModal"]/div/div/form/div/button')),
        5000
    );
    await button.click();
      
})

Then('A continue pop up should be present', async function () {
    const successBtn = await this.driver.wait(
        until.elementLocated(By.xpath('/html/body/div[6]/div/div[6]/button[1]')),
        5000 
      );
      

      await this.driver.wait(until.elementIsVisible(successBtn), 5000);
      
      const isDisplayed = await successBtn.isDisplayed();
      assert.strictEqual(isDisplayed, true, "The success button is not visible");
    
})