import { interactWrite, readContract } from 'smartweave';

import useArweave from './useArweave';

const TEST_CONTRACT_ADDRESS = '8GU6bCVo_ageRXtLEAhNODkzLEMHAycy_d4CprxXlbw';

export default function useContracts(wallet) {
  const arweave = useArweave();

  const getContractState = async () => {
    const contractState = await readContract(arweave, TEST_CONTRACT_ADDRESS);
    return contractState;
  };

  const onStake = async (id, cast, stakedAmount) => {
    const txId = await interactWrite(arweave, wallet, TEST_CONTRACT_ADDRESS, {
      function: 'stake',
      id,
      cast,
      stakedAmount
    });
    return txId;
  };

  const onDisburse = async (id) => {
    const txId = await interactWrite(arweave, wallet, TEST_CONTRACT_ADDRESS, {
      function: 'disburse',
      id
    });
    return txId;
  };

  return { getContractState, onStake, onDisburse };
}
