const axios = require('axios');
const assert = require('assert');
const Ajv = require('ajv');
const testDataCreate = require('./tests_create');
const testDataUpdate = require('./tests_update');

// ================== ВСПОМОГАТЕЛЬНОЕ ==================

// Правильное основание для alias из title
function buildAliasFromTitle(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')   // всё, что не латинские буквы/цифры -> '-'
        .replace(/^-+|-+$/g, '');      // убрать дефисы по краям
}

// Схема под реальный ответ API (по твоему PowerShell-примеру)
const productSchema = {
    type: 'object',
    properties: {
        id:          { type: 'string' },
        category_id: { type: 'string' },
        title:       { type: 'string' },
        alias:       { type: 'string' },
        content:     { type: ['string', 'null'] },
        price:       { type: 'string' },
        old_price:   { type: 'string' },
        status:      { type: 'string' },
        keywords:    { type: ['string', 'null'] },
        description: { type: ['string', 'null'] },
        hit:         { type: 'string' },
    },
    required: [
        'id',
        'category_id',
        'title',
        'alias',
        'price',
        'old_price',
        'status',
        'hit'
    ],
    additionalProperties: true
};

const ajv = new Ajv();
const validate = ajv.compile(productSchema);

// рабочий адрес
// http://shop2.qatl.ru/shop/api/products
const BASE_URL = 'http://shop2.qatl.ru/shop/api';

let saveId = []; // сюда сохраняем id созданных продуктов

describe('Product API Tests', function () {

    // Позитив: создание товаров из createProductData

    testDataCreate.createProductData.forEach((productData, index) => {
        it(`should add a new product ${index}`, async function () {
            this.timeout(100000);
            this.retries(1); // на случай сетевых глюков

            // отправляем POST /addproduct
            const response = await axios.post(`${BASE_URL}/addproduct`, productData);

            assert.strictEqual(response.status, 200, `Создание продукта ${index}: HTTP статус не 200`);
            assert.strictEqual(response.data.status, 1, `Создание продукта ${index}: status != 1 в теле ответа`);

            const newId = response.data.id;
            saveId.push(newId);

            // берём все товары и ищем наш
            const allProductsResponse = await axios.get(`${BASE_URL}/products`);
            assert.strictEqual(allProductsResponse.status, 200, 'GET /products вернул не 200');

            const allProducts = allProductsResponse.data;
            const createdProduct = allProducts.find(p => p.id == newId);

            assert.ok(
                createdProduct,
                `После добавления товар с id=${newId} не найден в списке /products`
            );

            // валидируем по схеме
            const valid = validate(createdProduct);
            if (!valid) {
                console.error('AJV errors for createdProduct:', validate.errors);
            }
            assert.strictEqual(
                valid,
                true,
                `Схема товара невалидна для созданного продукта id=${newId}`
            );

            // проверка alias
            assert.ok(createdProduct.alias, 'Alias не должен быть пустым');

            const expectedAliasBase = buildAliasFromTitle(createdProduct.title);

            // либо точное совпадение, либо base-0 / base-1 / ...
            assert.ok(
                createdProduct.alias === expectedAliasBase ||
                createdProduct.alias.startsWith(`${expectedAliasBase}-`),
                `Некорректный alias. Title='${createdProduct.title}', ` +
                `ожидаем '${expectedAliasBase}' или '${expectedAliasBase}-...', фактически '${createdProduct.alias}'`
            );

            console.log(`Создан продукт ${index}:`, response.data);
        });
    });

    // два товара с одинаковым title -> второй с -0

    it('should create two products with the same title and set alias with -0 for the second', async function () {
        this.timeout(100000);
        this.retries(1);

        const title = `Alias Duplicate Test ${Date.now()}`;

        const baseProduct = {
            category_id: "1",
            title: title,
            content: "Alias duplicate test product",
            price: "101",
            old_price: "99",
            status: "1",
            keywords: "alias, duplicate, test",
            description: "First product with this title",
            hit: "0"
        };

        // 1) создаём первый
        const createResp1 = await axios.post(`${BASE_URL}/addproduct`, baseProduct);
        assert.strictEqual(createResp1.status, 200);
        assert.strictEqual(createResp1.data.status, 1);
        const id1 = createResp1.data.id;

        // 2) создаём второй с тем же title
        const baseProduct2 = { ...baseProduct, price: "102" };
        const createResp2 = await axios.post(`${BASE_URL}/addproduct`, baseProduct2);
        assert.strictEqual(createResp2.status, 200);
        assert.strictEqual(createResp2.data.status, 1);
        const id2 = createResp2.data.id;

        try {
            const allProductsResponse = await axios.get(`${BASE_URL}/products`);
            assert.strictEqual(allProductsResponse.status, 200);
            const allProducts = allProductsResponse.data;

            const product1 = allProducts.find(p => p.id == id1);
            const product2 = allProducts.find(p => p.id == id2);

            assert.ok(product1, `Первый товар с id=${id1} не найден`);
            assert.ok(product2, `Второй товар с id+${id2} не найден`);

            const expectedAliasBase = buildAliasFromTitle(title);

            assert.strictEqual(
                product1.alias,
                expectedAliasBase,
                `Некорректный alias для первого товара. Ожидалось '${expectedAliasBase}', фактически '${product1.alias}'`
            );

            assert.strictEqual(
                product2.alias,
                `${expectedAliasBase}-0`,
                `Некорректный alias для второго товара. Ожидалось '${expectedAliasBase}-0', фактически '${product2.alias}'`
            );
        } finally {
            // cleanup
            try {
                await axios.get(`${BASE_URL}/deleteproduct?id=${id1}`);
            } catch (e) {
                console.warn(`Не удалось удалить первый тестовый товар id=${id1}`, e.response?.data || e.message);
            }
            try {
                await axios.get(`${BASE_URL}/deleteproduct?id=${id2}`);
            } catch (e) {
                console.warn(`Не удалось удалить второй тестовый товар id=${id2}`, e.response?.data || e.message);
            }
        }
    });

    // позитив: обновление товаров
    testDataUpdate.updateProductData.forEach((productData, index) => {
        it(`should update an existing product ${index}`, async function () {
            this.timeout(100000);
            this.retries(1);

            if (!saveId[index]) {
                assert.fail(`Нет сохранённого id для updateProductData[${index}]`);
            }

            const updatedData = { id: saveId[index], ...productData };

            const response = await axios.post(`${BASE_URL}/editproduct`, updatedData);
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.data.status, 1);

            console.log(`Обновлён продукт ${index}:`, response.data);
        });
    });

    // негатив: создание с плохими данными
    testDataCreate.badCreateProductData.forEach((badProductData, index) => {
        it(`should NOT add invalid product (case ${index})`, async function() {
            try {
            const response = await axios.post(`${BASE_URL}/addproduct`, badProductData);
          
            // Если сервер принимает bad-данные - это ошибка!
            if (response.data.status === 1) {
                assert.fail(`Server accepted invalid data: ${JSON.stringify(badProductData)}`);
            }
          
            // Ожидаем status: 0 или ошибку
            assert.notStrictEqual(response.data.status, 1);
          
            } catch (error) {
            // Если сервер возвращает HTTP-ошибку - это нормально
            assert.ok(error.response, "Expected error response");
            }
        });
    });

    // Для badUpdateProductData
    testDataUpdate.badUpdateProductData.forEach((badUpdateData, index) => {
        it(`should NOT update a product with invalid data (test case ${index})`, async function () {
            this.timeout(100000);
    
            try {
            const updatedData = { id: saveId[0], ...badUpdateData };
            const response = await axios.post(`${BASE_URL}/editproduct`, updatedData);
            
            if (response.data.status === 1) {
                assert.fail(`Server accepted invalid update: ${JSON.stringify(updatedData)}`);
            }
            
            assert.strictEqual(response.data.status, 0);
            
            } catch (error) {
            if (error.response) {
                assert.notStrictEqual(error.response.status, 200);
            } else if (error.request) {
                assert.fail("Server didn't respond");
            } else {
                assert.fail(`Unexpected error: ${error.message}`);
            }
            }
        });
    });

    // удаление первых двух созданных продуктов (cleanup)
    saveId.slice(0, 2).forEach((id, index) => {
        after(`should delete an existing product ${index}`, async function () {
            this.timeout(100000);
            this.retries(1);

            const response = await axios.get(`${BASE_URL}/deleteproduct?id=${id}`);
            assert.strictEqual(response.status, 200);
            assert.strictEqual(
                response.data.status,
                1,
                `Некорректное удаление продукта id=${id}: status != 1`
            );
        });
    });

    // тест чтения списка товаров
    it('should get products', async function () {
        this.timeout(100000);
        this.retries(1);

        const response = await axios.get(`${BASE_URL}/products`);
        assert.strictEqual(response.status, 200, 'GET /products вернул не 200');
        assert.notStrictEqual(response.data, null, 'Тело ответа /products - null');
        assert.ok(Array.isArray(response.data), 'Ответ /products должен быть массивом');
        assert.ok(response.data.length > 0, 'Список товаров пустой, ожидался хотя бы один');

        const product = response.data[response.data.length - 1];
        const valid = validate(product);
        if (!valid) {
            console.error('AJV errors for last product:', validate.errors);
        }
        assert.strictEqual(valid, true, 'Схема товара невалидна для последнего продукта из списка');
    });
});