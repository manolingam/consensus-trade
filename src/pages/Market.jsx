import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';
import Chart from 'chart.js';

import useArweave from '../hooks/useArweave';
import useContract from '../hooks/useContract';

var config = {
  type: 'pie',
  data: {
    datasets: [
      {
        data: [10, 6],
        backgroundColor: ['#444554', '#cfcfea'],
        label: 'Votes'
      }
    ],
    labels: ['Yay', 'Nay']
  },
  options: {
    responsive: true
  }
};

Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

const Market = (props) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const arweave = useArweave();

  const { onTransfer, onLock, onVote } = useContract(wallet);

  const uploadWallet = async (e) => {
    setLoading(true);
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        setWallet(JSON.parse(e.target.result));
        console.log(wallet);
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

  useEffect(() => {
    if (wallet) {
      arweave.wallets.jwkToAddress(wallet).then((address) => {
        setAddress(address);
      });
    }
    console.log(props);
  }, [arweave.wallets, wallet]);

  useEffect(() => {
    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, config);
  }, []);

  return (
    <div className='market'>
      <Link to='/'>
        <i id='back-icon' className='fas fa-arrow-left'></i>
      </Link>

      <p id='address'>{address}</p>

      <div className='grid-container'>
        <div className='left-container'>
          <div className='info-container'>
            <Avatar
              name={props.location.data.tweetUsername}
              size='md'
              src={props.location.data.tweetPhoto}
            />
            <h1>{props.location.data.tweetUsername}</h1>
            <p id='description'>{props.location.data.note}</p>
          </div>

          <div className='stat-container'>
            <div>
              <span>Market ends on</span>
              <p>{new Date().toDateString()}</p>
            </div>
            <div>
              <span>Total Weight</span>
              <p>{props.location.data.totalWeight}</p>
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
              <div className='vote-buttons'>
                <button style={{ marginRight: '15px' }}>Yes</button>
                <button>No</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Market);
