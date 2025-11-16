import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const [basketItems, setBasketItems] = useState([]);
    const [showNewItemIndicator, setShowNewItemIndicator] = useState(() => {
        const savedIndicator = localStorage.getItem('showNewItemIndicator');
        return savedIndicator === 'true';
    });
    const [indicatorSize, setIndicatorSize] = useState(1);

    useEffect(() => {
        localStorage.setItem('showNewItemIndicator', showNewItemIndicator);
    }, [showNewItemIndicator]);

    const addToBasket = (item) => {
        // Проверяем, есть ли товар уже в корзине
        const isItemInBasket = basketItems.some(basketItem => basketItem.id === item.id);

        if (isItemInBasket) {
            return false;
        }

        // Если товара нет в корзине, тогда добавляем его
        setBasketItems([...basketItems, { ...item, quantity: 1 }]);
        setShowNewItemIndicator(true);
        setIndicatorSize(prevSize => prevSize * 1.5);
        return true;
    };

    const removeFromBasket = (itemId) => {
        setBasketItems(basketItems.filter(item => item.id !== itemId)); // Удаляем товар из локального состояния
    };

    const clearNewItemIndicator = () => {
        setShowNewItemIndicator(false);
        setIndicatorSize(1);
    };

    return (
        <BasketContext.Provider value={{ basketItems, addToBasket, removeFromBasket, showNewItemIndicator, clearNewItemIndicator, indicatorSize }}>
            {children}
        </BasketContext.Provider>
    );
};

// ✅ Добавляем типизацию пропсов
BasketProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useBasket = () => useContext(BasketContext);