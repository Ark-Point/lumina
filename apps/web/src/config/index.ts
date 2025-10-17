const webConfig = {
  APP_HOST: process.env.NEXT_PUBLIC_HOST,
  API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
} as const;

const chainConfig = {
  base: {
    // sepolia
    chainId: 11155111,
    name: 'Ethereum sepolia',
    network: 'ethereum-sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
    nativeToken: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorer: {
      name: 'Sepolia Etherscan',
      url: 'https://sepolia.etherscan.io/',
    },
  },
};

export default {
  ...webConfig,
  chainConfig,
};
