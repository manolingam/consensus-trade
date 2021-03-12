import { useState, useEffect } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import { Spinner, useToast } from '@chakra-ui/react';

import Chart from 'chart.js';

import useArweave from '../hooks/useArweave';
import useContract from '../hooks/useContract';
import TransactionModal from '../components/TransactionModal';
import StakersModal from '../components/StakersModal';
import MarketInfo from '../components/MarketInfo';
import MarketVote from '../components/MarketVote';

Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

const axios = require('axios');

const VOTE_LENGTH = 2160;

const Market = (props) => {
  const { marketId } = useParams();
  const toast = useToast();

  const [market, setMarket] = useState('');
  const [tokenBalances, setTokenBalances] = useState('');
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [stakers, setStakers] = useState('');

  const [marketEndUnix, setMarketEndUnix] = useState('');
  const [marketCreatedUnix, setMarketCreatedUnix] = useState('');
  const [currentBlockHeight, setCurrentBlockHeight] = useState('');
  const [txId, setTxId] = useState('');
  const [stakeQty, setStakeQty] = useState(0);

  const [stakerCast, setStakerCast] = useState('');
  const [txModalStatus, setTxModalStatus] = useState(false);
  const [stakersModalStatus, setStakersModalStatus] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const arweave = useArweave();

  const { getContractState, onStake, onDisburse } = useContract(wallet);

  const uploadWallet = async (e) => {
    setLoading(true);
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        setWallet(JSON.parse(e.target.result));
      } catch (err) {
        setLoginError(true);
        console.error('Invalid wallet was uploaded.', err);
      }
    };
    if (e.target.files?.length) {
      fileReader.readAsText(e.target.files[0]);
    }
    setLoading(false);
  };

  const onMarketStake = async (id, cast, stakedAmount) => {
    if (stakedAmount > 0) {
      if (
        (stakerCast === 'yay' && cast === 'nay') ||
        (stakerCast === 'nay' && cast === 'yay')
      ) {
        return toast({
          title: 'Cannot stake on both sides.',
          status: 'error',
          duration: 5000,
          position: 'top'
        });
      }

      const trasactionId = await onStake(id, cast, stakedAmount);
      setTxId(trasactionId);
      setTxModalStatus(true);
      console.log(trasactionId);
    } else {
      setTxId('Invalid Inputs');
      toast({
        title: 'Stake Amount must be greater than zero.',
        status: 'error',
        duration: 5000,
        position: 'top'
      });
    }
  };

  const onConcludeMarket = async (id) => {
    const trasactionId = await onDisburse(id);
    setTxId(trasactionId);
    setTxModalStatus(true);
    console.log(trasactionId);

    axios
      .post(process.env.REACT_APP_API_ENDPOINT, {
        marketID: id
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const setChartConfig = () => {
    if (market.nays || market.yays) {
      var config = {
        type: 'pie',
        data: {
          datasets: [
            {
              data: [market.yays, market.nays],
              backgroundColor: ['#444554', '#cfcfea'],
              label: 'Votes'
            }
          ],
          labels: ['Yays', 'Nays']
        },
        options: {
          responsive: true
        }
      };
      var ctx = document.getElementById('myChart').getContext('2d');
      new Chart(ctx, config);
    }
  };

  useEffect(() => {
    if (wallet) {
      arweave.wallets.jwkToAddress(wallet).then((address) => {
        setAddress(address);
      });

      for (let key in market.staked) {
        if (key === address) {
          return setStakerCast(market.staked[key].cast);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arweave.wallets, wallet]);

  useEffect(() => {
    if (market) {
      let stakers = [];

      setChartConfig();
      setMarketCreatedUnix(market.tweetCreated);
      setMarketEndUnix(market.tweetCreated + 3000 * 60 * 60 * 24);

      for (let key in market.staked) {
        stakers.push({
          address: market.staked[key].address,
          amount: market.staked[key].amount
        });
      }

      setStakers(stakers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  const initData = async () => {
    let contractState = await getContractState();
    setTokenBalances(contractState.balances);
    let currentMarket = contractState.markets[marketId];
    setMarket(currentMarket);
    let blockHeight = await fetch('https://arweave.net/info');
    blockHeight = await blockHeight.json();
    setCurrentBlockHeight(blockHeight.height);
  };

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='market'>
      {!market && <Spinner size='xl' />}

      <Link to='/'>
        <i id='back-icon' className='fas fa-arrow-left'></i>
      </Link>

      {market && (
        <>
          <div className='grid-container'>
            <MarketInfo
              market={market}
              marketCreatedUnix={marketCreatedUnix}
              marketEndUnix={marketEndUnix}
              VOTE_LENGTH={VOTE_LENGTH}
              currentBlockHeight={currentBlockHeight}
            />

            <MarketVote
              market={market}
              wallet={wallet}
              currentBlockHeight={currentBlockHeight}
              VOTE_LENGTH={VOTE_LENGTH}
              marketId={marketId}
              stakeQty={stakeQty}
              loading={loading}
              loginError={loginError}
              setStakersModalStatus={setStakersModalStatus}
              uploadWallet={uploadWallet}
              setStakeQty={setStakeQty}
              onMarketStake={onMarketStake}
              onConcludeMarket={onConcludeMarket}
            />
          </div>
        </>
      )}

      {address && (
        <div className='address-container'>
          <p id='address'>{address}</p>
          <p>Balance: {tokenBalances[address] || 'NIL'}</p>
        </div>
      )}

      <TransactionModal
        txModalStatus={txModalStatus}
        txId={txId}
        setTxModalStatus={setTxModalStatus}
      />

      <StakersModal
        stakersModalStatus={stakersModalStatus}
        setStakersModalStatus={setStakersModalStatus}
        stakers={stakers}
      />
    </div>
  );
};

export default withRouter(Market);
