import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Switch } from '@chakra-ui/react';

import MarketCard from './MarketCard.jsx';

const MarketContainer = ({ category, markets }) => {
  const [recentMarkets, setRecentMarkets] = useState([]);
  const [popularMarkets, setPopularMarkets] = useState('');
  const [checkboxStatus, setCheckboxStatus] = useState(false);

  const sortMarkets = () => {
    if (markets.length && category !== 'failed') {
      let temp = [...markets];
      temp.sort((a, b) => {
        let a_stake = a.yays + a.nays;
        let b_stake = b.yays + b.nays;
        return a_stake < b_stake ? 1 : b_stake < a_stake ? -1 : 0;
      });
      setPopularMarkets(temp);
    }
  };

  const onCheckBoxChange = () => {
    sortMarkets();
    setCheckboxStatus((prevState) => !prevState);
  };

  useEffect(() => {
    if (markets) {
      let markets_reversed = markets.reverse();
      setRecentMarkets(markets_reversed);
    }
  }, [markets]);

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <h3>{category}</h3>
        {category !== 'Failed' && (
          <>
            <p style={{ fontSize: '12px', marginRight: '5px' }}>
              Filter by Popularity
            </p>
            <Switch
              colorScheme='gray'
              style={{ marginRight: '2rem' }}
              onChange={() => onCheckBoxChange()}
              isChecked={checkboxStatus}
            />
          </>
        )}
      </div>
      <div className='markets-container'>
        {recentMarkets.length !== 0 ? (
          checkboxStatus ? (
            popularMarkets.map((market, index) => {
              return (
                <Link
                  key={index}
                  to={{ pathname: `/market/${market.marketId}` }}
                >
                  <MarketCard data={market} />
                </Link>
              );
            })
          ) : (
            recentMarkets.map((market, index) => {
              return (
                <Link
                  key={index}
                  to={{ pathname: `/market/${market.marketId}` }}
                >
                  <MarketCard data={market} />
                </Link>
              );
            })
          )
        ) : (
          <p>No markets in this category</p>
        )}
      </div>
    </>
  );
};

export default MarketContainer;
