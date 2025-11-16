// pages/MainPage.js
const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class MainPage extends BasePage {
    constructor(driver, baseUrl) {
        super(driver, baseUrl);

        // Верхнее меню
        this.projectsLink = By.xpath("//a[contains(.,'Проекты')]");
        this.servicesLink = By.xpath("//a[contains(.,'Услуги')]");
        this.briefLink = By.xpath("//a[contains(.,'Заполнить бриф') or contains(.,'+ Стать клиентом')]");
    }

    async open() {
        await this.goto('/');
    }

    async openProjects() {
        await this.click(this.projectsLink);
    }

    async openServices() {
        await this.click(this.servicesLink);
    }

    async openBrief() {
        await this.click(this.briefLink);
    }
}

module.exports = MainPage;