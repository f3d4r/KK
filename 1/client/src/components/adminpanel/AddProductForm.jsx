import React, { useState } from 'react';
import axios from 'axios';
import './addproductform.css';

function AddProductForm({ onProductAdded }) {

  const [title, setTitle] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [characteristic, setCharacteristic] = useState('');

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Формируем объект нового товара
    const newProduct = {
      title,
      img,
      price: parseFloat(price),
      category,
      characteristic,
    };

    console.log('Данные для отправки:', newProduct);

    try {
      const response = await axios.post('http://localhost:5000/api/products', newProduct);
      onProductAdded(response.data);
      alert('Товар успешно добавлен!');
      setTitle('');
      setImg('');
      setPrice('');
      setCategory('');
      setCharacteristic('');
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      alert('Произошла ошибка при добавлении товара');
    }
  };

  return (
    <form className='add_product_form' onSubmit={handleSubmit}>
      <div>
        <input className='add_product_form_li'
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название товара"
          required
        />
      </div>
      <div>
        <input className='add_product_form_li'
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="Изображение (URL)"
          required
        />
      </div>
      <div>
        <input className='add_product_form_li'
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Цена"
          required
        />
      </div>
      <div>
        <select className='add_product_form_li'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Выберите категорию</option>
          <option value="Чехлы">Чехлы</option>
          <option value="Наушники">Наушники</option>
          <option value="Беспроводные наушники">Беспроводные наушники</option>
        </select>
      </div>
      <div>
      </div>
      <div>
        <textarea className='add_product_form_li'
          value={characteristic}
          onChange={(e) => setCharacteristic(e.target.value)}
          placeholder="Характеристики"
          required
        />
      </div>
      <button className='add_product_form_li' type="submit">Добавить товар</button>
    </form>
  );
}

export default AddProductForm;

//KK требует явного описания типов пропсов для React-компонента
import PropTypes from 'prop-types';

AddProductForm.propTypes = {
  onProductAdded: PropTypes.func.isRequired,
};