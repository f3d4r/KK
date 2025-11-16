import React from 'react';
import './header.css';
import { NavLink } from 'react-router-dom';
import { useBasket } from '../../components/context/basketcontext';
import { useContext } from 'react';
import { UserContext } from '../context/UseContext';

function Header() {
  const { showNewItemIndicator } = useBasket();
  const { user, logoutUser } = useContext(UserContext); // Получаем пользователя и logoutUser из контекста

  return (
    <header className='header'>
      <div className='container'>
        <div className='header_row'>
          <NavLink to="/" className='header_logo'>
            <span>QPICK</span>
          </NavLink>

          <div className='quick_search'>
            <div className='phone_icon'></div>
            <span>Выбрать модель телефона</span>
            <button className='quick_search__icon'></button>
          </div>

          <nav className='header_nav'>
            <ul>
              <NavLink to="/login">
                <li className='login_icon_size'>
                  <button className='login_cion'></button>
                  {user && (
                    <div className="user_info">
                      <span className="user_email">{user.email}</span>
                      <button className="logout_button" onClick={logoutUser}>Выход</button>
                    </div>
                  )}
                </li>
              </NavLink>

              <NavLink className='basket' to="/basket">
                <li>
                  <button className='cart_cion'>
                    {showNewItemIndicator && <span className="new_item_indicator">+</span>}
                  </button>
                </li>
              </NavLink>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;