import React from 'react'; //КК просто добавить импорт
import Promo from './../components/promo/promo'
import Covers from './../components/covers/covers';
import Headphones from './../components/headphones/headphones';
import WirelessHeadphones from './../components/wireless_headphones/wireless_headphones';


function Home () {
    return <section>
      <Promo />
      <Covers />
      <Headphones />
      <WirelessHeadphones />
    </section>
}


export default Home;