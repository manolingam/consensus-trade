import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';

import useArweave from '../../hooks/useArweave';

const Market = (props) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const arweave = useArweave();

  const uploadWallet = (e) => {
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
  );
};

export default withRouter(Market);
