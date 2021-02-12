import { useState, useEffect } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Spinner,
  useToast
} from '@chakra-ui/react';

import Chart from 'chart.js';

import useArweave from '../hooks/useArweave';
import useContract from '../hooks/useContract';

Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

const LOCK_LENGTH = 2160;

const Market = (props) => {
  const { marketId } = useParams();
  const toast = useToast();

  const [market, setMarket] = useState('');
  const [tokenBalances, setTokenBalances] = useState('');
  const [blockHeight, setBlockHeight] = useState('');
  const [marketEndHeight, setMarketEndHeight] = useState('');
  const [marketEndDate, setMarketEndDate] = useState('');
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [txId, setTxId] = useState('');
  const [stakeQty, setStakeQty] = useState(0);

  const [stakeStatus, setStakeStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
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
        // console.log(wallet);
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

  const getBlockHeight = async () => {
    let result = await fetch('https://arweave.net/info');
    result = await result.json();

    setBlockHeight(result.height);
    setMarketEndHeight(market.start + LOCK_LENGTH);
  };

  const onMarketStake = async (id, cast, stakedAmount) => {
    if (stakeStatus) {
      return toast({
        title: 'Cannot stake more than once.',
        status: 'error',
        duration: 5000,
        position: 'top'
      });
    }

    if (stakedAmount > 0) {
      const trasactionId = await onStake(id, cast, stakedAmount);
      setTxId(trasactionId);
      setModalStatus(true);
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
    setModalStatus(true);
    console.log(trasactionId);
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
        // eslint-disable-next-line array-callback-return
        market.staked.map((staker) => {
          if (staker.address === address) setStakeStatus(true);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arweave.wallets, wallet]);

  useEffect(() => {
    if (market) {
      setChartConfig();
      getBlockHeight();
      const copy = new Date(Number(new Date(market.tweetCreated)));
      copy.setDate(new Date(market.tweetCreated).getDate() + 3);
      setMarketEndDate(copy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  const initData = async () => {
    let contractState = await getContractState();
    setTokenBalances(contractState.balances);
    let currentMarket = contractState.markets[marketId];
    setMarket(currentMarket);
  };

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='market'>
      {market && (
        <>
          <div className='grid-container'>
            <div className='left-container'>
              <div className='avatar-container'>
                <Avatar
                  name={market.tweetUsername}
                  size='md'
                  src={market.tweetPhoto}
                />
                <h1>{market.tweetUsername}</h1>
              </div>

              <p id='description'>{market.tweet}</p>

              <div className='stat-container'>
                <div>
                  <span>Market created on</span>
                  <p>{new Date(market.tweetCreated).toDateString()}</p>
                </div>
                <div>
                  <span>Market ends on</span>
                  <p>{new Date(marketEndDate).toDateString()}</p>
                </div>
              </div>
            </div>

            <div className='right-container'>
              <div id='chart-container'>
                {market.yays || market.nays ? (
                  <canvas
                    id='myChart'
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  ></canvas>
                ) : (
                  <p style={{ fontSize: '28px' }}>No votes yet</p>
                )}
              </div>

              <div className='vote-container'>
                {market.status === 'active' ? (
                  !wallet ? (
                    <>
                      <label>Select a Wallet to Vote</label>
                      <input
                        type='file'
                        id='wallet-input'
                        onChange={uploadWallet}
                      />
                    </>
                  ) : blockHeight < marketEndHeight ? (
                    <>
                      <div className='input-container'>
                        <span>Amount to Stake</span>
                        <input
                          type='number'
                          min={1}
                          step='1'
                          onChange={(e) =>
                            setStakeQty(parseInt(e.target.value))
                          }
                          placeholder='Stake > 0'
                        />
                      </div>
                      <div className='vote-buttons'>
                        <button
                          style={{ marginRight: '15px' }}
                          onClick={() =>
                            onMarketStake(marketId, 'yay', stakeQty)
                          }
                        >
                          Yay
                        </button>
                        <button
                          onClick={() =>
                            onMarketStake(marketId, 'nay', stakeQty)
                          }
                        >
                          Nay
                        </button>
                      </div>
                    </>
                  ) : (
                    <button onClick={() => onConcludeMarket(marketId)}>
                      Finalize Market
                    </button>
                  )
                ) : (
                  <p style={{ fontSize: '24px' }}>Market {market.status}</p>
                )}

                {loading && (
                  <img
                    src='https://s.svgbox.net/loaders.svg?ic=bars'
                    alt='loader'
                  />
                )}

                {loginError && <p>Invalid Wallet</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {!market && <Spinner size='xl' />}

      <Link to='/'>
        <i id='back-icon' className='fas fa-arrow-left'></i>
      </Link>

      {address && (
        <div className='address-container'>
          <p id='address'>{address}</p>
          <p>Balance: {tokenBalances[address] || 'NIL'}</p>
        </div>
      )}

      <Modal
        onClose={() => setModalStatus(false)}
        isOpen={modalStatus}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Submitted!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              It takes variable time to update the state. By the time, you can
              check yout transaction status{' '}
              <a
                id='transaction-id'
                href={`https://viewblock.io/arweave/tx/${txId}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                here.
              </a>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setModalStatus(false);
                window.location.href = '/';
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withRouter(Market);
