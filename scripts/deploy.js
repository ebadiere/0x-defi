const { ethers } = require("hardhat");

require("dotenv").config();


const { mainnet: addresses } = require('../addresses');

async function main() {

    const provider = new ethers.providers.getDefaultProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  
    console.log(
      "Deploying contracts with the account:",
      wallet.address
    );

    // const SushiSwapRouter = await ethers.getContractFactory("")
    
    console.log("Account balance:", (await wallet.getBalance()).toString());

    let { bytecode } = require("../artifacts/contracts/uniswapv2/UniswapV2Router02.sol/UniswapV2Router02.json");

    const SushiswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02", bytecode, wallet);
    const sushiRouter = SushiswapV2Router02.attach(addresses.sushiswap.router);
  
    bytecode = require("../artifacts/contracts/Arbitrage.sol/Arbitrage.json")
    const Arbitrage = await ethers.getContractFactory("Arbitrage", bytecode, wallet);
    const arbitrage = await Arbitrage.deploy(addresses.uniswap.factory, sushiRouter.address);
  
    console.log("Arbitrage address:", arbitrage.address);
    console.log("Account balance:", (await wallet.getBalance()).toString());

  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });