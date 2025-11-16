import React, { useState } from 'react';
import PropTypes from 'prop-types'; //KK импорт проп тайпс
import axios from 'axios';
import './productitem.css';

function ProductItem({
  id,
  title,
  img,
  price,
  category,
  imgbuy,
  characteristic,
  onUpdate,
  onDelete,
}) {

  // Состояния для редактирования полей
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedImg, setEditedImg] = useState(img);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedImgbuy, setEditedImgbuy] = useState(imgbuy);
  const [editedCharacteristic, setEditedCharacteristic] = useState(characteristic);

  // В режим редактирования
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Сохранение изменений
  const handleSave = async () => {
    try {
      // Формируем объект с обновленными данными
      const updatedProduct = {
        title: editedTitle,
        img: editedImg,
        price: editedPrice,
        category: editedCategory,
        imgbuy: editedImgbuy,
        characteristic: editedCharacteristic,
      };

      console.log('Данные для отправки:', updatedProduct);
      console.log('ID продукта:', id);

      // Отправляем PUT-запрос на сервер
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, updatedProduct);

      console.log('Ответ от сервера:', response.data);

      // Обновляем состояние в родительском компоненте
      onUpdate(id, updatedProduct);

      // Выходим из режима редактирования
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении продукта:', error);
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setIsEditing(false);

    setEditedTitle(title);
    setEditedImg(img);
    setEditedPrice(price);
    setEditedCategory(category);
    setEditedImgbuy(imgbuy);
    setEditedCharacteristic(characteristic);
  };

  // Удаление товара
  const handleDelete = async () => {
    try {
      // Отправляем DELETE-запрос на сервер
      await axios.delete(`http://localhost:5000/api/products/${id}`);

      console.log('Товар успешно удален');

      // Уведомляем родительский компонент об удалении
      onDelete(id);
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };

  return (
    <div className={`product_item ${isEditing ? 'editing-mode' : 'view-mode'}`}>
      <div className="product_item_position">
        <div className="product-item-image">
          <img src={`http://localhost:5000/${img}`} alt={title} />
        </div>
        <div className={`product_item_details ${isEditing ? 'editing_details' : 'view_details'}`}>
          {isEditing ? (
            // Режим редактирования
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Название"
                className="edit-input"
              />
              <input
                type="text"
                value={editedImg}
                onChange={(e) => setEditedImg(e.target.value)}
                placeholder="Изображение (URL)"
                className="edit-input"
              />
              <input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                placeholder="Цена"
                className="edit-input"
              />
              <input
                type="text"
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                placeholder="Категория"
                className="edit-input"
              />
              <textarea
                value={editedCharacteristic}
                onChange={(e) => setEditedCharacteristic(e.target.value)}
                placeholder="Характеристики"
                className="edit-input"
              />
              <div className="edit_buttons">
                <button onClick={handleSave} className="edit_buttons_only">
                  Сохранить
                </button>
                <button onClick={handleCancel} className="edit_buttons_only">
                  Отмена
                </button>
              </div>
            </>
          ) : (
            // Режим просмотра
            <>
              <h3 className="product_item_title">Название: {title}</h3>
              <p className="product-item-price">Цена: {price}$</p>
              <p className="product_item_category">Категория: {category}</p>
              <p className="product-item-characteristic">Характеристика: {characteristic}</p>
            </>
          )}
        </div>
        <div className="edit_buttons_second">
          <button onClick={handleEdit} className="edit_button">
            Редактировать
          </button>
          <button onClick={handleDelete} className="edit_button delete_button">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

//KK Добавляем валидацию пропсов
ProductItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string.isRequired,
  imgbuy: PropTypes.string,
  characteristic: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductItem;