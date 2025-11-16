// pages/BriefPage.js
const BasePage = require('./BasePage');
const { By, until } = require('selenium-webdriver');

class BriefPage extends BasePage {
    constructor(driver, baseUrl) {
        super(driver, baseUrl);

        // Заголовок страницы Связаться с нами
        this.header = By.xpath("//h1[contains(.,'Связаться с нами')]");

        // Кнопка "Отправить заявку" / "Отправлено"
        this.submitButton = By.xpath(
            "//button[contains(.,'Отправить заявку') or contains(.,'Отправлено')]" +
            " | //input[@type='submit' and (contains(@value,'Отправить') or contains(@value,'Отправлено'))]"
        );

        // Интернет-магазин
        this.productTypeInternetShop = By.xpath(
            "//label[contains(normalize-space(),'Интернет-магазин')][1]"
        );

        // Бюджет
        this.budget300_600 = By.xpath(
            "//*[contains(text(),'Бюджет')]" +
            "/following::*[contains(.,'300 - 600 тыс.')][1]"
        );
         
        // Задача
        this.taskTextArea = By.css('textarea');

        this.nameInput = By.xpath(
            "//*[contains(text(),'Ваши контакты')]/following::input[1]"
        );
        this.emailInput = By.xpath(
            "//*[contains(text(),'Ваши контакты')]/following::input[2]"
        );
        this.companyInput = By.xpath(
            "//*[contains(text(),'Ваши контакты')]/following::input[3]"
        );
        this.phoneInput = By.xpath(
            "//*[contains(text(),'Ваши контакты')]/following::input[4]"
        );
    }

    async isOpened() {
        const text = await this.getText(this.header);
        return text.includes('Связаться с нами');
    }

    /**
     * Заполнить форму брифа тестовыми данными
     * data:
     * {
     *   task: string,
     *   name: string,
     *   email: string,
     *   company: string,
     *   phone: string
     * }
     */
    async fillBriefForm(data) {
        // 1. Тип продукта "Интернет-магазин"
        await this.click(this.productTypeInternetShop);

        await this.click(this.budget300_600);

        // 3. Задача
        await this.type(this.taskTextArea, data.task);

        // 4. Ваше имя
        await this.type(this.nameInput, data.name);

        // 5. E-Mail
        await this.type(this.emailInput, data.email);

        // 6. Название компании
        await this.type(this.companyInput, data.company);

        // 7. Телефон
        await this.type(this.phoneInput, data.phone);
    }

    /**
     * Просто клик по кнопке отправки
     */
    async clickSubmit() {
        await this.click(this.submitButton);
    }

    /**
     * Клик по кнопке и ожидание, пока она станет "Отправлено"
     * @returns {Promise<string>} финальный текст кнопки
     */
    async submitAndWaitForSuccess() {
        await this.clickSubmit();

        const button = await this.driver.findElement(this.submitButton);

        await this.driver.wait(
            until.elementTextContains(button, 'Отправлено'),
            10000
        );

        return button.getText();
    }
}

module.exports = BriefPage;