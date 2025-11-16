const axios = require('axios');

async function getExchangeRates() {
  try {
    const response = await axios.get('http://localhost:4545/exchange-rate');
    console.log('Курсы валют:', response.data);
  } catch (error) {
    console.error('Ошибка при получении курса валют:', error);
  }
}

getExchangeRates();