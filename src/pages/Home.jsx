import React, { useState, useEffect } from 'react';

import MarketContainer from '../components/MarketContainer';

import useContract from '../hooks/useContract';

import Logo from '../assets/logo.png';

const Home = () => {
  const [contractState, setContractState] = useState('');

  const { getContractState } = useContract();

  const fetchContractState = async () => {
    const newContractState = await getContractState();
    setContractState(newContractState);
    console.log(contractState);
  };

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

      {contractState
        ? contractState.votes.map((market, index) => {
            return (
              <MarketContainer
                key={index}
                category={
                  market.status === 'active'
                    ? 'Active'
                    : market.status === 'passed'
                    ? 'Passed'
                    : 'Failed'
                }
                market={market}
                index={index}
              />
            );
          })
        : null}

      {contractState ? console.log(contractState) : null}
    </div>
  );
};

export default Home;
