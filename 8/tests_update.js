module.exports = {
    updateProductData: [
        {
            category_id: 12,
            title: 'Updated Test Product 1',
            content: ' Updated Test Product Description 1',
            price: 1000,
            old_price: 90,
            status: 1,
            keywords: 'updated, test, product',
            description: 'Test product for testing purposes 1',
            hit: 0
        },
        {
            category_id: 1,
            title: 'Updated Test Product 2',
            content: 'Updated Test Product Description 2',
            price: 105401,
            old_price: 33234,
            status: 1,
            keywords: 'updated, test, product',
            description: 'Test product for testing purposes 2',
            hit: 1
        },
        {
            category_id: 10,
            title: 'Updated Test Product 3',
            content: 'Updated Test Product Description 3',
            price: 100433412,
            old_price: 332,
            status: 1,
            keywords: 'updated, test, product',
            description: 'Test product for testing purposes 3',
            hit: 1
        },
        {
            category_id: 10,
            title: 'Updated Test Product 4',
            content: 'Updated Test Product Description 3',
            price: 100433412,
            old_price: 332,
            status: 1,
            keywords: 'updated, test, product',
            description: 'Test product for testing purposes 3',
            hit: 1
        },
    ],

    badUpdateProductData: [
        {
            category_id: 16,
            title: 'category_id Updated Test Product 1(bad)',
            content: 'Updated Test Product Description 1',
            price: 100,
            old_price: 90,
            status: 1,
            keywords: 'badupdated, test, product',
            description: 'Test product for testing purposes 1',
            hit: 0
        },
        {
            category_id: 1,
            title: 'status Updated Test Product 2(bad)',
            content: 'UpdatedTest Product Description 2',
            price: 1001,
            old_price: 3,
            status: 3,
            keywords: 'badupdated, test, product',
            description: 'Test product for testing purposes 2',
            hit: 0
        },
        {
            category_id: 0,
            title: 'hit Updated Test Product 3(bad)',
            content: 'Updated Test Product Description 3',
            price: 1001,
            old_price: 3,
            status: 1,
            keywords: 'badupdated, test, product',
            description: 'Test product for testing purposes 3',
            hit: 10
        },
    ]
}