import React, { useState, useEffect } from 'react';

import MarketContainer from '../components/MarketContainer';

import useContract from '../hooks/useContract';

import Logo from '../assets/logo.png';

const Home = () => {
  const [contractState, setContractState] = useState('');
  const [activeMarkets, setActiveMarkets] = useState('');
  const [passedMarkets, setPassedMarkets] = useState('');
  const [failedMarkets, setFailedMarkets] = useState('');

  const { getContractState } = useContract();

  const fetchContractState = async () => {
    const newContractState = await getContractState();
    setContractState(newContractState);
  };

  useEffect(() => {
    let active_markets = [];
    let passed_markets = [];
    let failed_markets = [];

    if (contractState) {
      for (var key in contractState.markets) {
        if (contractState.markets[key].status === 'active') {
          active_markets.push(contractState.markets[key]);
        }

        if (contractState.markets[key].status === 'passed') {
          passed_markets.push(contractState.markets[key]);
        }

        if (contractState.markets[key].status === 'failed') {
          failed_markets.push(contractState.markets[key]);
        }
      }
    }

    setActiveMarkets(active_markets);
    setPassedMarkets(passed_markets);
    setFailedMarkets(failed_markets);
  }, [contractState]);

  useEffect(() => {
    fetchContractState();
  }, []);

  return (
    <div className='home'>
      <div className='front-page'>
        <a
          href='https://community.xyz/#HRut8B98Oe6pjs6OnZBfq93DhQVtRT9VfOER3e1-Ajg'
          target='_blank'
          rel='noopener noreferrer'
        >
          <i className='fas fa-users'></i>
        </a>
        <img id='logo' src={Logo} width='100px' alt='consensus-trade-logo' />
        <>
          <h1>Consensus Trade</h1>
          <p>
            Consensus Trade allows users to bet on the social consensus around
            the validity of assertions made on crypto twitter through the use of
            permaweb.
          </p>
        </>
      </div>

      {activeMarkets && (
        <MarketContainer category='Active' markets={activeMarkets} />
      )}
      {passedMarkets && (
        <MarketContainer category='Passed' markets={passedMarkets} />
      )}
      {failedMarkets && (
        <MarketContainer category='Failed' markets={failedMarkets} />
      )}
    </div>
  );
};

export default Home;
