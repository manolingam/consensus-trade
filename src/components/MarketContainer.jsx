import { Link } from 'react-router-dom';

import MarketCard from './MarketCard.jsx';

const MarketContainer = ({ category, market, index }) => {
  return (
    <>
      <h3>{category}</h3>
      <div className='markets-container'>
        <Link to={{ pathname: `/market/${index}`, data: market }}>
          <MarketCard data={market} />
        </Link>
      </div>
    </>
  );
};

export default MarketContainer;
