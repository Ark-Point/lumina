import * as Joi from 'joi';
import { Environment } from 'src/common/constant/environment';

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid(...Object.values(Environment)),
    PORT: Joi.number().required(),
    APP_ORIGIN: Joi.string().required(),
    API_ORIGIN: Joi.string().required(),
    // CORS
    ALLOWED_CORS_ORIGIN: Joi.string(),
    // DB
    // DATABASE_HOST: Joi.string(),
    // DATABASE_PORT: Joi.number(),
    // DATABASE_USER: Joi.string(),
    // DATABASE_PASSWORD: Joi.string(),
    // DATABASE_NAME: Joi.string(),
    // DATABASE_LOGGING: Joi.boolean(),
    // Redis
    // REDIS_HOST: Joi.string(),
    // REDIS_PORT: Joi.string(),
    // Auth
    // JWT_PRIVATE_BASE64: Joi.string(),
    // JWT_PUBLIC_BASE64: Joi.string(),
    //BlockChain
    // BLOCKCHAIN_RPC_URL: Joi.string().required(),
    // BLOCKCHAIN_CHAIN_ID: Joi.number().required(),
    // BLOCKCHAIN_ADMIN_WALLET_KEY: Joi.string().required(),
    // BLOCKCHAIN_ADMIN_WALLET_ADDRESS: Joi.string().required(),
  });
}
