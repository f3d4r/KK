// pages/BasePage.js
const ACTION_DELAY_MS = 1000; // задержка между действиями в миллисекундах

class BasePage {
    /**
     * @param {import('selenium-webdriver').WebDriver} driver
     * @param {string} baseUrl
     */
    constructor(driver, baseUrl) {
        this.driver = driver;
        this.baseUrl = baseUrl;
    }

    async goto(path = '/') {
        await this.driver.get(`${this.baseUrl}${path}`);
        if (ACTION_DELAY_MS > 0) {
            await this.driver.sleep(ACTION_DELAY_MS);
        }
    }

    async click(byLocator) {
        const el = await this.driver.findElement(byLocator);
        await el.click();
        if (ACTION_DELAY_MS > 0) {
            await this.driver.sleep(ACTION_DELAY_MS);
        }
    }

    async type(byLocator, text) {
        const el = await this.driver.findElement(byLocator);
        await el.clear();
        await el.sendKeys(text);
        if (ACTION_DELAY_MS > 0) {
            await this.driver.sleep(ACTION_DELAY_MS);
        }
    }

    async getText(byLocator) {
        const el = await this.driver.findElement(byLocator);
        const text = await el.getText();
        if (ACTION_DELAY_MS > 0) {
            await this.driver.sleep(ACTION_DELAY_MS);
        }
        return text;
    }
}

module.exports = BasePage;