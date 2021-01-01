import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';
import Chart from 'chart.js';

import useArweave from '../hooks/useArweave';

Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

const Market = (props) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const arweave = useArweave();

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
  }, [arweave.wallets, wallet]);

  useEffect(() => {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['20 Dec', '21 Dec', '22 Dec', '23 Dec', '24 Dec', '25 Dec'],
        datasets: [
          {
            label: 'Yay Votes',
            data: [12, 19, 3, 5, 2, 3],
            // backgroundColor: ['rgba(207, 207, 234, 0.5)'],
            borderColor: ['#00A5CF'],
            borderWidth: 1,
            fill: false
          },
          {
            label: 'Nay Votes',
            data: [10, 5, 13, 22, 2, 3],
            // backgroundColor: ['rgba(207, 207, 234, 0.5)'],
            borderColor: ['#D62246'],
            borderWidth: 1,
            fill: false
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }, []);

  return (
    <div className='market'>
      <Link to='/'>
        <i id='back-icon' className='fas fa-arrow-left'></i>
      </Link>

      <p id='address'>{address}</p>

      <Avatar
        name='Dan Abrahmov'
        size='xl'
        src={`https://robohash.org/${props.location.data.id}.png`}
      />
      <h1>{props.location.data.title}</h1>
      <p id='description'>{props.location.data.body}</p>
      <div className='stat-container'>
        <div>
          <span>Market ends on</span>
          <p>{new Date().toDateString()}</p>
        </div>
        <div>
          <span>Trade volume</span>
          <p>$12,1211</p>
        </div>
        <div>
          <span>Liquidity</span>
          <p>$12,111</p>
        </div>
      </div>
      <div className='grid-container'>
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
            <img src='https://s.svgbox.net/loaders.svg?ic=bars' alt='loader' />
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
  );
};

export default withRouter(Market);
