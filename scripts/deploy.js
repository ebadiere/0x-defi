const { ethers } = require("hardhat");

require("dotenv").config();
const { bytecode } = require("../artifacts/contracts/Arbitrage.sol/Arbitrage.json")

const { kovan: addresses } = require('../addresses');

async function main() {

    const url = process.env.NODE_URL;
    const provider = new ethers.providers.getDefaultProvider();

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  
    console.log(
      "Deploying contracts with the account:",
      wallet.address
    );
    
    console.log("Account balance:", (await wallet.getBalance()).toString());
  

    const Arbitrage = await ethers.getContractFactory("Arbitrage", bytecode, wallet);
    const arbitrage = await Arbitrage.deploy(addresses.uniswap.factory, addresses.sushiswap.router);
  
    console.log("Arbitrage address:", arbitrage.address);

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });