// pages/WorksPage.js
const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class WorksPage extends BasePage {
    constructor(driver, baseUrl) {
        super(driver, baseUrl);

        this.header = By.xpath("//h1[contains(.,'Свежесделанное')]");
    }

    async isOpened() {
        const text = await this.getText(this.header);
        return text.includes('Свежесделанное');
    }

    async isProjectPresent(title) {
        const locator = By.xpath(
            "//*[self::h2 or self::h3][contains(.,'" + title + "')]"
        );
        try {
            const elText = await this.getText(locator);
            return elText.includes(title);
        } catch (e) {
            return false;
        }
    }

    async clickProjectSiteLink(hostPart) {
        const locator = By.xpath("//a[contains(@href, '" + hostPart + "')]");
        await this.click(locator);
    }
}

module.exports = WorksPage;