import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-truffle5";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  // solidity: "0.8.28",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "cancun",
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts: { count: 1000 },
    },
    sepolia: {
      chainId: 11155111,
      url: `https://capable-nameless-meme.ethereum-sepolia.quiknode.pro/15b59387343e932d3cc716c58f7e8e9b11456d25/`,
      accounts: [process.env.OPERATOR_KEY || ""],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io/",
        },
      },
    ],
  },
  mocha: {
    timeout: 20000, // 20초
    bail: false, // 첫 실패에서 멈추지 않음
    parallel: false, // 병렬 실행 비활성화 (기본은 false)
  },
};

export default config;
