import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../components/context/UseContext';
import { useBasket } from '../components/context/basketcontext';
import '../components/context/basket.css';
import { NavLink } from 'react-router-dom';
import basketFree from '../img/banner/basket_free.png';
import axios from 'axios';
import buybutton from '../img/icons/buy.png'
import deleteimg from '../img/icons/deleteimg.png'

function Basket() {
    const { user } = useContext(UserContext);
    const { clearNewItemIndicator, removeFromBasket } = useBasket();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузки корзины
    const fetchCartItems = useCallback(() => {
        if (user && user.id) {
            axios.get(`http://localhost:5000/api/cart/${user.id}`)
                .then(() => {   //КК response убран
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке корзины:', error);
                    setError('Ошибка при загрузке корзины');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    // Загружаем корзину при изменении пользователя
    useEffect(() => {
        clearNewItemIndicator();
        fetchCartItems();
    }, [clearNewItemIndicator, fetchCartItems]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleRemoveFromBasket = (cartId) => {
        axios.delete(`http://localhost:5000/api/cart/${cartId}`)
            .then(() => {   //КК response убран
                // Удаляем товар из локального состояния корзины
                setCartItems(cartItems.filter(item => item.cartId !== cartId));
                // Удаляем товар из контекста корзины
                if (typeof removeFromBasket === 'function') {
                    removeFromBasket(cartId);
                } else {
                    console.error('removeFromBasket is not a function');
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении товара из корзины:', error);
                alert('Не удалось удалить товар из корзины');
            });
    };

    return (
        <section>
            <div className="container">
                <div className="basket_field">
                    <h3 className='basket_title'>Корзина</h3>

                    {cartItems.length === 0 ? (
                        <div className="">
                            <img className='basketfree_img' src={basketFree} alt="Корзина пуста" />
                            <p className='basketfree_title'>Корзина пуста</p>
                            <p className='basketfree_subtitle'>Но это никогда не поздно исправить :)</p>
                            <NavLink to='/' className='basketfree_button'>В каталог товаров</NavLink>
                        </div>
                    ) : (
                        <>
                            <ul className='basket_ul'>
                                {cartItems.map(item => (
                                    <div className='basket_ul_info' key={item.cartId}>
                                        <li className='basket_ul_info_position'>
                                            <button onClick={() => handleRemoveFromBasket(item.cartId)} className='remove_button'>
                                                 <img src={deleteimg} alt="X" />
                                            </button>
                                            <h3>{item.title}</h3>
                                            <img className='img_basket' src={`http://localhost:5000/${item.img}`} alt={item.title} />
                                            <div className="position">
                                                <div className='one'>Цена: {item.price}$</div>
                                                <img className='buy_botton' src={buybutton} alt="Купить" />
                                            </div>
                                        </li>
                                        <NavLink to={`/product/${item.id}`} className='go_to_product_info'>
                                            <div>Узнать больше о товаре</div>
                                        </NavLink>
                                    </div>
                                ))}
                            </ul>
                            {!user && (
                                <div className="notification">
                                    Для оформления заказа необходимо авторизоваться.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Basket;