// pages/ServicesPage.js
const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class ServicesPage extends BasePage {
    constructor(driver, baseUrl) {
        super(driver, baseUrl);

        this.header = By.xpath("//h1[contains(.,'Услуги')]");
    }

    async isOpened() {
        const text = await this.getText(this.header);
        return text.includes('Услуги');
    }

    async isServicePresent(name) {
        const locator = By.xpath("//a[contains(.,'" + name + "')]");
        try {
            const text = await this.getText(locator);
            return text.includes(name);
        } catch (e) {
            return false;
        }
    }
}

module.exports = ServicesPage;