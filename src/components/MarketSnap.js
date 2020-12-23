import React from 'react';
import { Avatar } from '@chakra-ui/react';

const MarketSnap = ({ data }) => {
  return (
    <div className='markets-snap-container'>
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
      {/* <div>
        <i className='fas fa-chevron-right'></i>
      </div> */}
    </div>
  );
};

export default MarketSnap;
