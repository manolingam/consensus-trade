const MarketVote = ({
  market,
  wallet,
  currentBlockHeight,
  VOTE_LENGTH,
  marketId,
  stakeQty,
  loading,
  loginError,
  setStakersModalStatus,
  uploadWallet,
  setStakeQty,
  onMarketStake,
  onConcludeMarket
}) => {
  return (
    <div className='right-container'>
      <div id='chart-container'>
        {market.yays || market.nays ? (
          <>
            <canvas
              id='myChart'
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            ></canvas>
            <p id='stakers-button' onClick={() => setStakersModalStatus(true)}>
              View Stakers
            </p>
          </>
        ) : (
          <p style={{ fontSize: '28px', marginRight: '50px' }}>No votes yet</p>
        )}
      </div>

      <div className='vote-container'>
        {market.status === 'active' ? (
          !wallet ? (
            <>
              <label>Select a Wallet to Vote</label>
              <input type='file' id='wallet-input' onChange={uploadWallet} />
            </>
          ) : currentBlockHeight < market.start + VOTE_LENGTH ? (
            <>
              <div className='input-container'>
                <span>Amount to Stake</span>
                <input
                  type='number'
                  min={1}
                  step='1'
                  onChange={(e) => setStakeQty(parseInt(e.target.value))}
                  placeholder='Stake > 0'
                />
              </div>
              <div className='vote-buttons'>
                <button
                  className='button'
                  style={{ marginRight: '15px' }}
                  onClick={() => onMarketStake(marketId, 'yay', stakeQty)}
                >
                  Yay
                </button>
                <button
                  className='button'
                  onClick={() => onMarketStake(marketId, 'nay', stakeQty)}
                >
                  Nay
                </button>
              </div>
            </>
          ) : (
            <button
              className='button'
              onClick={() => onConcludeMarket(marketId)}
            >
              Finalize Market
            </button>
          )
        ) : (
          <p style={{ fontSize: '24px' }}>Market {market.status}</p>
        )}

        {loading && (
          <img src='https://s.svgbox.net/loaders.svg?ic=bars' alt='loader' />
        )}

        {loginError && <p>Invalid Wallet</p>}
      </div>
    </div>
  );
};

export default MarketVote;
