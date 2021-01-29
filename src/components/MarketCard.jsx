import React from 'react';
import { Avatar } from '@chakra-ui/react';

const MarketCard = ({ data }) => {
  console.log(data);
  return (
    <div className='market-card'>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <Avatar name={data.tweetUsername} size='md' src={data.tweetPhoto} />
        <h4>{data.tweetUsername}</h4>
      </div>
      <a id='note' href={data.tweetLink}>
        {data.note}
      </a>
      <div className='body-container'>
        <div className='weights-container'>
          <span>Total Weight</span>
          <p>{data.totalWeight}</p>
        </div>
        <div className='votes-container'>
          <p>
            <i className='fas fa-thumbs-up'></i> {data.yays}
          </p>
          <p>
            <i className='fas fa-thumbs-down'></i> {data.nays}
          </p>
          <p></p>
        </div>
      </div>
      <span id='date'>{new Date(data.tweetCreated).toDateString()}</span>
    </div>
  );
};

export default MarketCard;
