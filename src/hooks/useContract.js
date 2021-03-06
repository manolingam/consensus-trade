import { interactWrite, readContract } from 'smartweave';

import useArweave from './useArweave';

const PROD_CONTRACT_ADDRESS = '4BM86e-zd_XBSY4nFFH3Kz_9GY2jkcEmnxe7CKqONIw';

export default function useContracts(wallet) {
  const arweave = useArweave();

  const getContractState = async () => {
    const contractState = await readContract(arweave, PROD_CONTRACT_ADDRESS);
    return contractState;
  };

  const onStake = async (id, cast, stakedAmount) => {
    const txId = await interactWrite(arweave, wallet, PROD_CONTRACT_ADDRESS, {
      function: 'stake',
      id,
      cast,
      stakedAmount
    });
    return txId;
  };

  const onDisburse = async (id) => {
    const txId = await interactWrite(arweave, wallet, PROD_CONTRACT_ADDRESS, {
      function: 'disburse',
      id
    });
    return txId;
  };

  return { getContractState, onStake, onDisburse };
}
