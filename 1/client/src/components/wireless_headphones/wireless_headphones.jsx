import React, { useState, useEffect } from 'react';
import './wireless_headphones.css';
import Card from '../card/card';
import axios from 'axios';

function WirelessHeadphones() {
  const [wirelessHeadphones, setWirelessHeadphones] = useState([]);

  useEffect(() => {
    // Загрузка данных с сервера
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        // Фильтруем данные по категории "Беспроводные наушники"
        const filteredWirelessHeadphones = response.data.filter(card => card.category === 'Беспроводные наушники');
        setWirelessHeadphones(filteredWirelessHeadphones); // Устанавливаем отфильтрованные данные
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  return (
    <section className='wireless_headphones'>
      <div className="container">
        <div className="wireless_headphones_header">
          <h2 className='tittle_2'>Беспроводные наушники</h2>
        </div>
        <div className="wireless_headphones_cards">
          {wirelessHeadphones.map(card => (
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

export default WirelessHeadphones;