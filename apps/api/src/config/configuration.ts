import local from './local';
import dev from './dev';
import prod from './prod';
import { Environment } from 'src/common/constant/environment';
import { ethers } from 'ethers';

const config = {
  [Environment.LOCAL]: local,
  [Environment.DEV]: dev,
  [Environment.PROD]: prod,
} as const;

const env = (process.env.NODE_ENV as keyof typeof config) || Environment.LOCAL;
const contractConfig = config[env];

export default () => ({
  ...contractConfig,
  app: {
    environment: env,
    port: +process.env.PORT,
    apiOrigin: process.env.API_ORIGIN, // api url
    allowedCorsOrigins: process.env.ALLOWED_CORS_ORIGIN?.split(',') || [],
  },
  // database: {
  //   type: process.env.DATABASE_TYPE,
  //   host: process.env.DATABASE_HOST,
  //   port: process.env.DATABASE_PORT,
  //   user: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PASSWORD,
  //   name: process.env.DATABASE_NAME,
  //   logging: process.env.DATABASE_LOGGING === 'true' ? true : false,
  // },
  // cache: {
  //   redis: {
  //     url: process.env.REDIS_URL,
  //   },
  //   defaultTtlMilliseconds: 60,
  //   flushOnStart: true,
  // },
  // jwt: {
  //   private: Buffer.from(process.env.JWT_PRIVATE_BASE64, 'base64').toString(
  //     'utf8',
  //   ),
  //   public: Buffer.from(process.env.JWT_PUBLIC_BASE64, 'base64').toString(
  //     'utf8',
  //   ),
  // },
  // blockchain: {
  //   rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
  //   rpcProvider: new ethers.providers.JsonRpcProvider(
  //     process.env.BLOCKCHAIN_RPC_URL,
  //   ),
  //   adminWalletAddress: process.env.BLOCKCHAIN_ADMIN_WALLET_ADDRESS,
  //   adminWalletKey: process.env.BLOCKCHAIN_ADMIN_WALLET_KEY,
  //   chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID),
  // },
});
