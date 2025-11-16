const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');


const app = express();
const port = 5000;


// Отдача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для обработки JSON и CORS
app.use(cors());
app.use(express.json());

// Обслуживаем статические файлы из папки "public"
app.use('/images', express.static('public/images'));

// Подключение к базе данных MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '**********',
  database: 'magazine'
});

// Проверка подключения к базе данных
db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключение к базе данных успешно установлено');
  }
});

// Обработчик для корневого маршрута
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// API для получения всех товаров
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM cards';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      res.json(result);
    }
  });
});

// API для получения товара по ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM cards WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
      if (err) {
          console.error('Ошибка при выполнении запроса:', err);
          res.status(500).send('Ошибка сервера');
      } else {
          if (result.length > 0) {
              res.json(result[0]);
          } else {
              res.status(404).send('Товар не найден');
          }
      }
  });
});

// API для получения товаров по списку ID
app.post('/api/products/by-ids', (req, res) => {
  const productIds = req.body.ids;
  if (!Array.isArray(productIds)) {
    return res.status(400).send('Некорректный формат данных: ожидается массив ID');
  }

  const sql = 'SELECT * FROM cards WHERE id IN (?)';
  db.query(sql, [productIds], (err, result) => {
    if (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      res.json(result);
    }
  });
});

// API для получения отзывов по ID товара
app.get('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const sql = `
    SELECT reviews.*, users.email 
    FROM reviews 
    JOIN users ON reviews.user_id = users.id 
    WHERE product_id = ?
  `;

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      res.json(result);
    }
  });
});

// API для добавления отзыва
app.post('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const { text, userId } = req.body;

  if (!text) {
    return res.status(400).send('Текст отзыва обязателен');
  }

  const sql = 'INSERT INTO reviews (product_id, user_id, text) VALUES (?, ?, ?)';
  db.query(sql, [productId, userId || null, text], (err, result) => {
    if (err) {
      console.error('Ошибка при добавлении отзыва:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      res.status(201).json({ id: result.insertId, product_id: productId, text, date: new Date() });
    }
  });
});

// API для добавления товара
app.post('/api/products', (req, res) => {
  const { title, img, price, raiting, category, characteristic } = req.body;

  if (!title || !img || !price || !category || !characteristic) {
    return res.status(400).send('Все поля обязательны для заполнения');
  }

  const sql = 'INSERT INTO cards (title, img, price, raiting, category, characteristic) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, img, price, raiting || null, category, characteristic], (err, result) => {
    if (err) {
      console.error('Ошибка при добавлении товара:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      res.status(201).json({ id: result.insertId, title, img, price, raiting, category, characteristic });
    }
  });
});

// API для обновления товара
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { title, img, price, raiting, category, characteristic } = req.body;

  const sql = `
    UPDATE cards 
    SET title = ?, img = ?, price = ?, raiting = ?, category = ?, characteristic = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, img, price, raiting || null, category, characteristic, id],
    (err) => { // КК result убран
      if (err) {
        console.error('Ошибка при обновлении продукта:', err);
        res.status(500).json({ message: 'Ошибка при обновлении продукта' });
      } else {
        res.json({ id, ...req.body });
      }
    }
  );
});

// API для удаления товара
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM cards WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Ошибка при удалении товара:', err);
      res.status(500).json({ message: 'Ошибка при удалении товара' });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Товар успешно удален' });
      } else {
        res.status(404).json({ message: 'Товар не найден' });
      }
    }
  });
});

// API для регистрации пользователя
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email и пароль обязательны');
  }

  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Ошибка при регистрации пользователя:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      res.status(201).json({ id: result.insertId, email });
    }
  });
});

// API для авторизации пользователя
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email и пароль обязательны');
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Ошибка при авторизации пользователя:', err);
      res.status(500).send('Ошибка сервера');
    } else {
      if (result.length > 0) {
        res.json({ message: 'Вход выполнен', user: result[0] });
      } else {
        res.status(401).send('Неверный email или пароль');
      }
    }
  });
});

//Для добавления в корзину
app.post('/api/cart/add', (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: 'Необходимо указать userId и productId' });
    }

    const checkUserSql = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserSql, [userId], (err, userResult) => {
        if (err) {
            console.error('Ошибка при проверке пользователя:', err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const checkProductSql = 'SELECT * FROM cards WHERE id = ?';
        db.query(checkProductSql, [productId], (err, productResult) => {
            if (err) {
                console.error('Ошибка при проверке товара:', err);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            if (productResult.length === 0) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            // Проверяем, есть ли товар уже в корзине
            const checkCartSql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
            db.query(checkCartSql, [userId, productId], (err, cartResult) => {
                if (err) {
                    console.error('Ошибка при проверке корзины:', err);
                    return res.status(500).json({ message: 'Ошибка сервера' });
                }

                if (cartResult.length > 0) {
                    // Если товар уже есть в корзине, возвращаем ошибку
                    return res.status(400).json({ message: 'Товар уже в корзине' });
                } else {
                    // Если товара нет в корзине, добавляем его
                    const addToCartSql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)';
                    db.query(addToCartSql, [userId, productId], (err) => { // КК result убран
                        if (err) {
                            console.error('Ошибка при добавлении товара в корзину:', err);
                            return res.status(500).json({ message: 'Ошибка сервера' });
                        }
                        return res.status(201).json({ message: 'Товар добавлен в корзину' });
                    });
                }
            });
        });
    });
});

// API для получения корзины пользователя
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  // Проверка, существует ли пользователь
  const checkUserSql = 'SELECT * FROM users WHERE id = ?';
  db.query(checkUserSql, [userId], (err, result) => {
    if (err) {
      console.error('Ошибка при проверке пользователя:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получаем товары из корзины пользователя
    const getCartSql = `
      SELECT cart.id AS cartId, cart.quantity, cards.id, cards.title, cards.img, cards.price, cards.raiting, cards.category, cards.characteristic 
      FROM cart
      JOIN cards ON cart.product_id = cards.id
      WHERE cart.user_id = ?
    `;
    db.query(getCartSql, [userId], (err, result) => {
      if (err) {
        console.error('Ошибка при получении корзины:', err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
      return res.status(200).json(result);
    });
  });
});

// API для удаления товара из корзины
app.delete('/api/cart/:cartId', (req, res) => {
  const cartId = req.params.cartId;

  // Проверка, существует ли запись в корзине
  const checkCartSql = 'SELECT * FROM cart WHERE id = ?';
  db.query(checkCartSql, [cartId], (err, result) => {
    if (err) {
      console.error('Ошибка при проверке корзины:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Товар в корзине не найден' });
    }

    // Удаляем товар из корзины
    const deleteCartSql = 'DELETE FROM cart WHERE id = ?';
    db.query(deleteCartSql, [cartId], (err) => { // КК result убран
      if (err) {
        console.error('Ошибка при удалении товара из корзины:', err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
      return res.status(200).json({ message: 'Товар удален из корзины' });
    });
  });
});



// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});