import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button
} from '@chakra-ui/react';

import Chart from 'chart.js';

import useArweave from '../hooks/useArweave';
import useContract from '../hooks/useContract';

Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

// const LOCK_LENGTH = 2160;

const Market = (props) => {
  const [modalStatus, setModalStatus] = useState(false);

  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [txId, setTxId] = useState('');

  const [stakeQty, setStakeQty] = useState(0);

  const arweave = useArweave();

  const { onStake } = useContract(wallet);

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

  const onMarketStake = async (id, cast, stakedAmount) => {
    if (Number(stakedAmount) > 0) {
      const trasactionId = await onStake(id, cast, Number(stakedAmount));
      setTxId(trasactionId);
      setModalStatus(true);
      console.log(trasactionId);
    } else {
      setTxId('Invalid Inputs');
      alert('Stake cannot be zero!');
    }
  };

  useEffect(() => {
    if (wallet) {
      arweave.wallets.jwkToAddress(wallet).then((address) => {
        setAddress(address);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arweave.wallets, wallet]);

  useEffect(() => {
    var config = {
      type: 'pie',
      data: {
        datasets: [
          {
            data: [props.location.data.yays, props.location.data.nays],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='market'>
      <Link to='/'>
        <i id='back-icon' className='fas fa-arrow-left'></i>
      </Link>

      <p id='address'>{address}</p>

      <div className='grid-container'>
        <div></div>
        <div className='left-container'>
          <div className='info-container'>
            <Avatar
              name={props.location.data.tweetUsername}
              size='md'
              src={props.location.data.tweetPhoto}
            />
            <h1>{props.location.data.tweetUsername}</h1>
            <p id='description'>{props.location.data.tweet}</p>
          </div>

          <div className='stat-container'>
            <div>
              <span>Market created on</span>
              <p>{new Date(props.location.data.tweetCreated).toDateString()}</p>
            </div>
            <div>
              <span>Market ends on</span>
              <p>{new Date().toDateString()}</p>
            </div>
          </div>
        </div>

        <div className='right-container'>
          <div id='chart-container'>
            <canvas
              id='myChart'
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            ></canvas>
          </div>
          <div className='vote-container'>
            {!wallet && (
              <>
                <label>Select a Wallet to Vote</label>
                <input type='file' onChange={uploadWallet} />
              </>
            )}

            {loading && (
              <img
                src='https://s.svgbox.net/loaders.svg?ic=bars'
                alt='loader'
              />
            )}

            {loginError && <p>Invalid Wallet</p>}

            {wallet && (
              <>
                <div className='input-container'>
                  <span>Amount to Stake</span>
                  <input
                    type='number'
                    min={1}
                    onChange={(e) => setStakeQty(e.target.value)}
                    placeholder='Stake > 0'
                  />
                </div>
                <div className='vote-buttons'>
                  <button
                    style={{ marginRight: '15px' }}
                    onClick={() =>
                      onMarketStake(
                        props.location.data.marketId,
                        'yay',
                        stakeQty
                      )
                    }
                  >
                    Yay
                  </button>
                  <button
                    onClick={() =>
                      onMarketStake(
                        props.location.data.marketId,
                        'nay',
                        stakeQty
                      )
                    }
                  >
                    Nay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div></div>
      </div>

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
            <Button onClick={() => setModalStatus(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default withRouter(Market);
