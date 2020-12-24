import React from 'react';

import MarketContainer from '../components/MarketContainer';

import Logo from '../assets/logo.png';

const { MARKETS } = require('../utils/constants');

const Home = () => {
  return (
    <div className='home'>
      <div className='front-page'>
        <a
          href='https://community.xyz/#HRut8B98Oe6pjs6OnZBfq93DhQVtRT9VfOER3e1-Ajg'
          target='_blank'
          rel='noopener noreferrer'
        >
          <i className='fas fa-users'></i>
        </a>
        <img id='logo' src={Logo} width='100px' alt='consensus-trade-logo' />
        <>
          <h1>Consensus Trade</h1>
          <p>
            Consensus Trade allows users to bet on the social consensus around
            the validity of assertions made on crypto twitter through the use of
            permaweb.
          </p>
        </>
      </div>
      <MarketContainer category='Recent Markets' MARKETS={MARKETS} />
      <MarketContainer category='Active Markets' MARKETS={MARKETS} />
      <MarketContainer category='Concluded Markets' MARKETS={MARKETS} />
    </div>
  );
};

export default Home;
