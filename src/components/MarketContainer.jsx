import { Link } from 'react-router-dom';

import MarketCard from './MarketCard.jsx';

const MarketContainer = ({ category, markets }) => {
  return (
    <>
      <h3>{category}</h3>
      <div className='markets-container'>
        {markets.length !== 0 ? (
          markets.map((market, index) => {
            return (
              <Link
                key={index}
                to={{ pathname: `/market/${index}`, data: market }}
              >
                <MarketCard data={market} />
              </Link>
            );
          })
        ) : (
          <p>No markets in this category</p>
        )}
      </div>
    </>
  );
};

export default MarketContainer;
