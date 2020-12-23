import React from 'react';
import { Link } from 'react-router-dom';

import MarketSnap from '../../components/MarketSnap';

const { MARKETS } = require('../../utils/constants');

const Home = () => {
  return (
    <div className='home'>
      <h1>Consensus Trade</h1>
      <h3>All Markets</h3>
      <div className='markets-container'>
        {MARKETS.map((market) => {
          return (
            <Link
              key={market.id}
              to={{ pathname: `/market/${market.id}`, data: market }}
            >
              <MarketSnap data={market} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
