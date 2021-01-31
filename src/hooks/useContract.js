import { interactWrite, readContract } from 'smartweave';

import useArweave from './useArweave';

const CONTRACT_ADDRESS = 'iEPkBNzZTNXSsEJUKL-RH5N1IkEf83EGWG2-L3kSa3s';

export default function useContracts(wallet) {
  const arweave = useArweave();

  const getContractState = async () => {
    const contractState = await readContract(arweave, CONTRACT_ADDRESS);
    return contractState;
  };

  const onStake = async (id, cast, stakedAmount) => {
    const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
      function: 'stake',
      id,
      cast,
      stakedAmount
    });
    return txId;
  };

  return { getContractState, onStake };
}
