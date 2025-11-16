// tests/uiTests.selenium.spec.js
const assert = require('assert');
const path = require('path');
const { By, until } = require('selenium-webdriver');

const { buildDriver } = require('../driverFactory');
const testData = require(path.join(__dirname, '..', 'config', 'uiTestData.json'));

const MainPage = require('../pages/MainPage');
const WorksPage = require('../pages/WorksPage');
const ServicesPage = require('../pages/ServicesPage');
const BriefPage = require('../pages/BriefPage');

describe('UI Acceptance Tests for koptelnya.ru (Selenium)', function () {
    this.timeout(60000);

    /** @type {import('selenium-webdriver').WebDriver} */
    let driver;

    let mainPage;
    let worksPage;
    let servicesPage;
    let briefPage;

    before(async () => {
        // Читаем браузер из переменной среды BROWSER
        const browserName = process.env.BROWSER || 'MicrosoftEdge';

        driver = await buildDriver(browserName);
        await driver.manage().window().maximize();

        mainPage = new MainPage(driver, testData.baseUrl);
        worksPage = new WorksPage(driver, testData.baseUrl);
        servicesPage = new ServicesPage(driver, testData.baseUrl);
        briefPage = new BriefPage(driver, testData.baseUrl);
    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('1. Заполнение и отправка брифа', async () => {
        // 1. Зашли на сайт
        await mainPage.open();

        // 2. Перешли на страницу брифа
        await mainPage.openBrief();

        // 3. Проверили, что открыта страница "Связаться с нами"
        const opened = await briefPage.isOpened();
        assert.ok(opened, 'Страница брифа (Связаться с нами) не открылась');

        // 4. Заполнили форму данными из конфига
        await briefPage.fillBriefForm(testData.brief);
        // testData.brief должен быть в config/uiTestData.json, например:
        // "brief": {
        //   "task": "Хочу интернет-магазин...",
        //   "name": "Тестовый Клиент",
        //   "email": "test@example.com",
        //   "company": "ООО Тест",
        //   "phone": "+7 (999) 123-45-67"
        // }

        // 5. Нажали "Отправить заявку" и дождались "Отправлено"
        const finalButtonText = await briefPage.submitAndWaitForSuccess();

        // 6. Проверка: кнопка действительно показывает "Отправлено"
        assert.ok(
            finalButtonText.includes('Отправлено'),
            `Ожидали текст кнопки "Отправлено", а получили: "${finalButtonText}"`
        );
    });

    it('2. Страница "Услуги" содержит пункт "Разработка Интернет-магазина"', async () => {
        await mainPage.open();
        await mainPage.openServices();

        await driver.wait(
            until.elementLocated(By.xpath("//h1[contains(.,'Услуги')]")),
            10000
        );

        const isOpened = await servicesPage.isOpened();
        assert.ok(isOpened, 'Страница "Услуги" не открылась');

        const serviceExists = await servicesPage.isServicePresent(
            testData.services.ecommerceServiceName
        );

        assert.ok(
            serviceExists,
            `На странице "Услуги" не найден пункт "${testData.services.ecommerceServiceName}"`
        );
    });

    it('3. Страница "Проекты" содержит кейс "Интернет-магазин эксклюзивной итальянской продукции из трюфеля"', async () => {
        await mainPage.open();
        await mainPage.openProjects();

        await driver.wait(
            until.elementLocated(By.xpath("//h1[contains(.,'Свежесделанное')]")),
            10000
        );

        const isOpened = await worksPage.isOpened();
        assert.ok(isOpened, 'Страница "Проекты / Свежесделанное" не открылась');

        const projectExists = await worksPage.isProjectPresent(
            testData.projects.italianMarketTitle
        );

        assert.ok(
            projectExists,
            `На странице проектов не найден кейс "${testData.projects.italianMarketTitle}"`
        );
    });

    it('4. Переход из раздела "Проекты" на внешний сайт Italian Market', async () => {
        await mainPage.open();
        await mainPage.openProjects();

        await driver.wait(
            until.elementLocated(By.xpath("//h1[contains(.,'Свежесделанное')]")),
            10000
        );

        // Кликаем по ссылке на внешний сайт
        await worksPage.clickProjectSiteLink(testData.projects.italianMarketHost);

        // Ждём открытие новой вкладки / окна
        const handles = await driver.getAllWindowHandles();
        assert.ok(handles.length >= 1, 'Не удалось получить список окон браузера');

        // Переключаемся на последнее окно (скорее всего – новое)
        const lastHandle = handles[handles.length - 1];
        await driver.switchTo().window(lastHandle);

        const currentUrl = await driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes(testData.projects.italianMarketHost),
            `Ожидали переход на сайт с доменом "${testData.projects.italianMarketHost}", ` +
            `но открыта страница: ${currentUrl}`
        );
    });
});