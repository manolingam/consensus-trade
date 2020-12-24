import { Link } from 'react-router-dom';

import MarketCard from './MarketCard.jsx';

const MarketContainer = ({ category, MARKETS }) => {
  return (
    <>
      <h3>{category}</h3>
      <div className='markets-container'>
        {MARKETS.map((market) => {
          return (
            <Link
              key={market.id}
              to={{ pathname: `/market/${market.id}`, data: market }}
            >
              <MarketCard data={market} />
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default MarketContainer;
