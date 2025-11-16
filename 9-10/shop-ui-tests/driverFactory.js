// driverFactory.js
const { Builder } = require('selenium-webdriver');

/**
 * Создаёт удалённый WebDriver для нужного браузера.
 *
 * @param {'chrome'|'firefox'|'MicrosoftEdge'} browserName
 */
async function buildDriver(browserName = 'chrome') {
  const gridUrl = process.env.SELENIUM_GRID_URL || 'http://localhost:4444';

  const driver = await new Builder()
    .usingServer(gridUrl)   
    .forBrowser(browserName) 
    .build();

  return driver;
}

module.exports = { buildDriver };