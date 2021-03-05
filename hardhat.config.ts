import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import { HardhatUserConfig } from "hardhat/types";

import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname+'/.env' });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.6.12",
  networks: {
    hardhat: {
      forking: {
        url: `${process.env.NODE_URL}`
      }
    },
    kovan: {
      chainId: 42,
      url: `${process.env.NODE_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    // tenderly: {
    //   project: `${process.env.TENDERLY_PROJECT}`,
    //   username: `${process.env.TENDERLY_USERNAME}`,
    // },        
  },
};

export default config;


