import React, { useState, useEffect } from 'react';
import Card from '../card/card';
import './covers.css';
import axios from 'axios';

function Covers() {
  const [covers, setCovers] = useState([]);

  useEffect(() => {
    // Загрузка данных с сервера
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        // Фильтруем данные по категории "Чехлы"
        const filteredCovers = response.data.filter(card => card.category === 'Чехлы');
        setCovers(filteredCovers); // Устанавливаем отфильтрованные данные
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  return (
    <section className='covers'>
      <div className="container">
        <div className="covers_header">
          <h2 className='tittle_2'>Чехлы</h2>
        </div>
        <div className="covers_cards">
          {covers.map(card => (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              img={card.img}
              price={card.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Covers;