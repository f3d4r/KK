import React from 'react';
import PropTypes from 'prop-types'; // KK
import './card.css';
import { NavLink } from 'react-router-dom';

function Card(props) {

    return (
        <section className='card'>
            <div className="container">
                <NavLink to={`/product/${props.id}`} className='card_link'>
                    <img className='card_image' alt={props.title} src={`http://localhost:5000/${props.img}`} /> {/* Изображение загружается с сервера */}
                </NavLink>
                <div className="card_body">
                    <NavLink to={`/product/${props.id}`} className="card_text">
                        <div className="card_title">
                            {props.title}
                        </div>
                    </NavLink>
                    <div className="card_price">{props.price}$</div>
                </div>
            </div>
        </section>
    );
}

// ✅ Добавляем валидацию пропсов
Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Card;