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
          justifyContent: 'flex-start'
        }}
      >
        <Avatar name={data.tweetUsername} size='md' src={data.tweetPhoto} />
        <h4>{data.tweetUsername}</h4>
      </div>
      <a id='note' href={data.tweetLink}>
        {data.tweet}
      </a>

      <div className='votes-container'>
        <p>
          <i className='fas fa-thumbs-up'></i> {data.yays}
        </p>
        <p>
          <i className='fas fa-thumbs-down'></i> {data.nays}
        </p>
        <p></p>
      </div>

      {data.status !== 'active' && data.yays > data.nays && (
        <p style={{ color: '#00af91' }}>
          Consensus for this assertion is "Yes"
        </p>
      )}
      {data.status !== 'active' && data.yays < data.nays && (
        <p style={{ color: '#ff5e78' }}>Consensus for this assertion is "No"</p>
      )}

      <span id='date'>{new Date(data.tweetCreated).toDateString()}</span>
    </div>
  );
};

export default MarketCard;
