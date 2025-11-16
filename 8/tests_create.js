module.exports = {
    createProductData: [
        {
            category_id: 1,
            title: 'abc Test Product 1',
            content: 'Test Product Description 1',
            price: 100,
            old_price: 90,
            status: 1,
            keywords: 'test, product',
            description: 'Test product for testing purposes 1',
            hit: 0
        },
        {
            category_id: 1,
            title: 'abc Test Product 2',
            content: 'Test Product Description 2',
            price: 1001,
            old_price: 3,
            status: 1,
            keywords: 'test, product',
            description: 'Test product for testing purposes 2',
            hit: 1
        },
        {
            category_id: 10,
            title: 'abc Test Product 3',
            content: 'Test Product Description 3',
            price: 10012,
            old_price: 332,
            status: 1,
            keywords: 'test, product',
            description: 'Test product for testing purposes 3',
            hit: 1
        },
        {
            category_id: 8,
            title: 'abc Test Product 4',
            content: 'Test Product Description 4',
            price: 10012,
            old_price: 332,
            status: 1,
            keywords: 'test, product',
            description: 'Test product for testing purposes 3',
            hit: 1
        },
    ],

    badCreateProductData: [
        {
            category_id: 16,
            title: 'category_id Test Product 1(bad)',
            content: 'Test Product Description 1(bad)',
            price: 100,
            old_price: 90,
            status: 1,
            keywords: 'test, product',
            description: 'Test product for testing purposes 1',
            hit: 0
        },
        {
            category_id: 0,
            title: 'status Test Product 2(bad)',
            content: 'Test Product Description 2(bad)',
            price: 1001,
            old_price: 3,
            status: 3,
            keywords: 'test, product',
            description: 'Test product for testing purposes 2',
            hit: 0
        },
        {
            category_id: 0,
            title: 'hit Test Product 3(bad)',
            content: 'Test Product Description 3(bad)',
            price: 1001,
            old_price: 3,
            status: 1,
            keywords: 'test, product',
            description: 'Test product for testing purposes 3',
            hit: 10
        },
    ]
}