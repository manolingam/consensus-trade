import { interactWrite, readContract } from 'smartweave';

import useArweave from './useArweave';

const CONTRACT_ADDRESS = '1kKyFOGOW8db1ahA8FVLOE29praXGXwXgRqcXQR_aUg';

export default function useContracts(wallet) {
  const arweave = useArweave();

  const getContractState = async () => {
    const contractState = await readContract(arweave, CONTRACT_ADDRESS);
    return contractState;
  };

  const onTransfer = async (target, qty) => {
    const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
      function: 'transfer',
      target,
      qty
    });
    return txId;
  };

  const onLock = async (qty, lockLength) => {
    const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
      function: 'lock',
      qty,
      lockLength
    });
    return txId;
  };

  const onCreateMarket = async (
    type,
    note,
    tweetUsername,
    tweetPhoto,
    tweetCreated,
    tweetLink
  ) => {
    console.log('creating market');
    const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
      function: 'propose',
      type,
      note,
      tweetUsername,
      tweetPhoto,
      tweetCreated,
      tweetLink
    });
    return txId;
  };

  const onVote = async (id, cast) => {
    const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
      function: 'vote',
      id,
      cast
    });
    return txId;
  };

  return { getContractState, onTransfer, onLock, onCreateMarket, onVote };
}
