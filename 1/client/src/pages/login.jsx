import React, { useState, useContext } from 'react';
import '../style/login.css';
import login_box_image from '../img/icons/login_box_image.png';
import { UserContext } from '../components/context/UseContext';

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const { loginUser } = useContext(UserContext);

    const handleActionChange = (e) => {
        setIsSignUp(e.target.value === 'signup');
        setLoginMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignUp) {
            // Регистрация
            if (!email || !password || !repeatPassword) {
                setLoginMessage('Поля не могут быть пустыми');
                return;
            }

            if (password !== repeatPassword) {
                setLoginMessage('Пароли не совпадают');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    setLoginMessage('Вы успешно зарегистрированы');
                    loginUser({ email, id: data.id }); // Автоматически входим после регистрации
                } else {
                    setLoginMessage(data.message || 'Ошибка при регистрации');
                }
            } catch (error) {
                console.error('Ошибка при регистрации:', error);
                setLoginMessage('Ошибка при регистрации');
            }
        } else {
            // Авторизация
            if (!email || !password) {
                setLoginMessage('Поля не могут быть пустыми');
                return;
            }

            // Проверка на вход администратора
            if (email === 'admin1@gmail.com' && password === 'admin12345') {
                setLoginMessage('Вы вошли как администратор');
                loginUser({ email: 'admin1@gmail.com', id: 'admin' }); // Вход администратора
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    setLoginMessage('Вход выполнен');
                    loginUser({ email, id: data.user.id }); // Вход пользователя
                } else {
                    setLoginMessage(data.message || 'Неверный email или пароль');
                }
            } catch (error) {
                console.error('Ошибка при входе:', error);
                setLoginMessage('Ошибка при входе');
            }
        }
    };

    return (
        <div className="container">
            <div className="login_box">
                <img className="login_box_img" src={login_box_image} alt="Login" />
                <div className="login_box_menu">
                    <form onSubmit={handleSubmit}>
                        <input
                            checked={!isSignUp}
                            id="signin"
                            name="action"
                            type="radio"
                            value="signin"
                            onChange={handleActionChange}
                        />
                        <label className='font_style' htmlFor="signin">Sign in</label>
                        <input
                            checked={isSignUp}
                            id="signup"
                            name="action"
                            type="radio"
                            value="signup"
                            onChange={handleActionChange}
                        />
                        <label className='font_style' htmlFor="signup">Sign up</label>
                        <div id="wrapper">
                            <div id="arrow"></div>
                            <input
                                className='font_styles'
                                id="email"
                                placeholder="Email"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className='font_styles'
                                id="pass"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {isSignUp && (
                                <input
                                    className='font_styles'
                                    id="repass"
                                    placeholder="Repeat password"
                                    type="password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                            )}
                        </div>

                        {loginMessage && (
                            <div className={`login_message ${loginMessage.includes('не') ? 'error' : 'success'}`}>
                                {loginMessage}
                            </div>
                        )}

                        <button className='submits' type="submit">
                            <span>
                                {isSignUp ? 'Sign up' : 'Sign in'}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;