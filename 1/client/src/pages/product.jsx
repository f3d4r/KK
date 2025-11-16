import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../components/context/UseContext';
import { useBasket } from '../components/context/basketcontext';
import '../style/product.css';
import baskettake from '../img/icons/cart_icon.png';

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [notification, setNotification] = useState('');
    const [sortType, setSortType] = useState('newest');

    const { user } = useContext(UserContext);
    const { addToBasket } = useBasket();

    // Загрузка данных о товаре и отзывах
    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setError('Товар не найден');
                setLoading(false);
            });

        axios.get(`http://localhost:5000/api/products/${id}/reviews`)
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке отзывов:', error);
            });
    }, [id]);

    // Добавление товара в корзину
    const handleAddToBasket = async () => {
        if (!user || !user.id) {
            setNotification('Для добавления товара в корзину необходимо авторизоваться');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            return;
        }

        if (product) {
            try {
                const response = await axios.post('http://localhost:5000/api/cart/add', {
                    userId: user.id,
                    productId: product.id,
                });

                if (response.status === 201) {
                    addToBasket(product);
                    setNotification('Товар добавлен в корзину');
                } else {
                    setNotification('Ошибка при добавлении товара в корзину');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setNotification('Товар уже в корзине');
                } else {
                    console.error('Ошибка при добавлении товара в корзину:', error);
                    setNotification('Ошибка при добавлении товара в корзину');
                }
            } finally {
                setTimeout(() => {
                    setNotification('');
                }, 3000);
            }
        }
    };

    // Добавление отзыва
    const handleAddReview = () => {
        if (!user || !user.id) {
            setNotification('Для добавления отзыва необходимо авторизоваться');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            return;
        }

        if (newReview.trim()) {
            axios
                .post(`http://localhost:5000/api/products/${id}/reviews`, {
                    text: newReview,
                    userId: user.id,
                })
                .then((response) => {
                    setReviews([...reviews, { ...response.data, email: user.email }]);
                    setNewReview('');
                })
                .catch((error) => {
                    console.error('Ошибка при отправке отзыва:', error);
                });
        }
    };

    // Сортировака отзывов
    const sortReviews = (reviews, type) => {
        switch (type) {
            case 'newest':
                return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date));
            default:
                return reviews;
        }
    };

    // Отсортированные отзывы
    const sortedReviews = sortReviews(reviews, sortType);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Если произошла ошибка
    if (error) {
        return <div>{error}</div>;
    }

    // Если товар не найден
    if (!product) {
        return <div>Товар не найден</div>;
    }

    return (
        <section>
            <div className="container">
                <div className="product_position_field">
                    <span className='product_title'>{product.title}</span>

                    <div className="product_field">
                        <div className="product_img_filed">
                            <img className='product_img' src={`http://localhost:5000/${product.img}`} alt={product.title} />
                        </div>
                        <div className="product_info">
                            <div className="product_info_poisition">
                                <div className='product_price'>Цена: {product.price}$</div>
                                <div>Характеристика: {product.characteristic}</div>
                                <div className="card_full_notofication">
                                    <button onClick={handleAddToBasket} className="add_to_basket_button">
                                        <img className='card_image_raiting' src={baskettake} alt="" />
                                    </button>
                                    {notification && (
                                        <div className="notification">
                                            {notification}
                                        </div>
                                    )}
                                </div>
                                <div className="add_comment">
                                    <div className="comment_text">Оставить отзыв:</div>
                                    <textarea
                                        className='comment_text_box'
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                        placeholder="|"
                                    />
                                    <button className='goto_comment' onClick={handleAddReview}>Отправить отзыв</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pepole_comment">
                        <div className="people_comment_block">
                            Отзывы других покупателей
                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                                className="sort_select"
                            >
                                <option value="newest">Сначала новые</option>
                                <option value="oldest">Сначала старые</option>
                            </select>
                        </div>
                        {sortedReviews.map((review, index) => (
                            <div className='people_comment_other' key={index}>
                                <p className='email_date_box'>
                                    <p className='email_box_size'> {review.email} </p>
                                    <p className='date_margin'> {new Date(review.date).toLocaleDateString()}</p>
                                </p>
                                <p className='review_text'>{review.text}</p>
                            </div>
                        ))}
                        <div className="comment_end_effect"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Product;