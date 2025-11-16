import React from 'react'; // КК просто добавить импорт
import './footer.css';
import worldiconFooter from './../../img/icons/world_icon.png'

import { NavLink } from 'react-router-dom';


function Footer () {
    return <footer className='footer'>
        <div className='container'>
            <div className='footer_header'>

                <NavLink to="/" className='footer_logo'>
                    <span>QPICK</span>
                </NavLink>

                <div className="nav_controller">
                    <nav>
                        <ul className='footer_nav'>
                            <li><a className=''>Избранное</a></li>
                            <li><a className=''>Корзина</a></li>
                            <li><a className=''>Контакты</a></li>
                        </ul>
                    </nav>


                    <div>
                        <span className="footer_subtitle">Условия сервиса</span>
                        <div className="">
                            <ul className="lang_menu">
                                <li><img src={worldiconFooter}/></li>
                                <li><span>Каз</span></li>
                                <li><span>Рус</span></li>
                                <li><span>Eng</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
}


export default Footer;