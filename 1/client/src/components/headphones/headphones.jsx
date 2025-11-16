import React, { useState, useEffect } from 'react';
import './headphones.css';
import Card from '../card/card';
import axios from 'axios';

function Headphones() {
  const [headphones, setHeadphones] = useState([]);

  useEffect(() => {
    // Загрузка данных с сервера
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        // Фильтруем данные по категории
        const filteredHeadphones = response.data.filter(card => card.category === 'Наушники');
        setHeadphones(filteredHeadphones);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  return (
    <section className='headphones'>
      <div className="container">
        <div className="headphones_header">
          <h2 className='tittle_2'>Наушники</h2>
        </div>
        <div className="headphones_cards">
          {headphones.map(card => (
            <Card key={card.id} id={card.id} title={card.title} img={card.img} price={card.price} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Headphones;