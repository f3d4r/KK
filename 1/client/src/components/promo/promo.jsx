import React from 'react';  // КК
import './promo.css';
import PromoImg from '../../img/banner/iPhone-13-Pro-Max-silver.png';

function Promo () {
    return(<section className='promo'>
        <div className="container">
            <div className="promo_content">
                <a className="promo_text__title">
                    Аксессуары для <br/> Iphone 13 Pro Max
                </a>
                <div className="promo_image">
                    <img src={PromoImg} alt='banner'/>
                </div>
            </div>
        </div>
    </section>);
}

export default Promo;