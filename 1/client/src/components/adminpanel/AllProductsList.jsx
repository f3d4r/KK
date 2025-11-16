import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import '../../style/allproductslist.css';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  // Функция для обновления товара
  const handleUpdateProduct = (id, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  // Функция для удаления товара
  const handleDeleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  // Фильтрация товаров по названию
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="container">
      <div className="all_products_header">
        <h2 className='tittle_2'>Все товары</h2>

        <div>
          <input className='search_window'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по названию"
          />
        </div>
      </div>
      <div className="all_products_cards_size">
        <div className="all_products_cards">
          {filteredProducts.map(product => (
            <ProductItem
              key={product.id}
              id={product.id}
              title={product.title}
              img={product.img}
              price={product.price}
              category={product.category}
              characteristic={product.characteristic}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;