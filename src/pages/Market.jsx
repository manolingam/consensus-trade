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
                </div>
                <div>
                  <span>Market ends on</span>
                  <p>{new Date(marketEndUnix).toDateString()}</p>
                </div>
              </div>
            </div>

            <div className='right-container'>
              <div id='chart-container'>
                {market.yays || market.nays ? (
                  <>
                    <canvas
                      id='myChart'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    ></canvas>
                    <p
                      id='stakers-button'
                      onClick={() => setStakersModalStatus(true)}
                    >
                      View Stakers
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: '28px', marginRight: '50px' }}>
                    No votes yet
                  </p>
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
                  ) : currentBlockHeight < market.start + VOTE_LENGTH ? (
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
                          className='button'
                          style={{ marginRight: '15px' }}
                          onClick={() =>
                            onMarketStake(marketId, 'yay', stakeQty)
                          }
                        >
                          Yay
                        </button>
                        <button
                          className='button'
                          onClick={() =>
                            onMarketStake(marketId, 'nay', stakeQty)
                          }
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
        onClose={() => setTxModalStatus(false)}
        isOpen={txModalStatus}
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
                setTxModalStatus(false);
                window.location.href = '/';
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        onClose={() => setStakersModalStatus(false)}
        isOpen={stakersModalStatus}
        isCentered
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stakers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {stakers &&
              stakers.map((item, index) => {
                return (
                  <div className='stakers-container' key={index}>
                    <p>{item.address}</p>
                    <p>{item.amount}</p>
                  </div>
                );
              })}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setStakersModalStatus(false);
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
