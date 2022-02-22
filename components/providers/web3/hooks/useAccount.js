import { useEffect } from 'react';
import useSWR from 'swr';

const adminAddresses = {
  '0x72d4e4e0007f378ba7f1f41c0581201ad6f3dcf9172c640d1edfa266459c2ed7': true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? 'web3/accounts' : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    }
  );

  useEffect(() => {
    provider &&
      provider.on('accountsChanged', (accounts) => mutate(accounts[0] ?? null));
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
