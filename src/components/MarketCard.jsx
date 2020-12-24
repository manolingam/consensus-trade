import React from 'react';
import { Avatar } from '@chakra-ui/react';

const MarketCard = ({ data }) => {
  return (
    <div className='market-card'>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '.5rem'
        }}
      >
        <Avatar
          name='Dan Abrahmov'
          size='md'
          src={`https://robohash.org/${data.id}.png`}
        />
        <h4>{data.title}</h4>
      </div>
      <p>{data.body}</p>
      <span id='date'>{new Date().toDateString()}</span>
    </div>
  );
};

export default MarketCard;
