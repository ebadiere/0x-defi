require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@tenderly/hardhat-tenderly");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.6",
  networks: {
    hardhat: {
      forking: {
        url: process.env.NODE_URL
      }
    },
    kovan: {
      url: `${process.env.NODE_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    // tenderly: {
    //   project: `${process.env.TENDERLY_PROJECT}`,
    //   username: `${process.env.TENDERLY_USERNAME}`,
    // },        
  },
  
};

