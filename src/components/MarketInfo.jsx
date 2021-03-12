import { Avatar } from '@chakra-ui/react';

const MarketInfo = ({
  market,
  marketCreatedUnix,
  marketEndUnix,
  VOTE_LENGTH,
  currentBlockHeight
}) => {
  return (
    <div className='left-container'>
      <div className='avatar-container'>
        <Avatar name={market.tweetUsername} size='md' src={market.tweetPhoto} />
        <h1>{market.tweetUsername}</h1>
      </div>

      <a
        id='description'
        href={market.tweetLink}
        style={{ textDecoration: 'underline' }}
      >
        {market.tweet}
      </a>

      <div className='stat-container'>
        <div>
          <span>Market created on</span>
          <p>{new Date(marketCreatedUnix).toDateString()}</p>
          <i style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            at {market.start} height
          </i>
        </div>
        <div>
          <span>Market ends on</span>
          <p>{new Date(marketEndUnix).toDateString()}</p>
          <i style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            at {market.start + VOTE_LENGTH} height
          </i>
        </div>
        <p
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            color: '#cfcfea',
            marginTop: '10px'
          }}
        >
          Current height: {currentBlockHeight}
        </p>
      </div>
    </div>
  );
};

export default MarketInfo;
