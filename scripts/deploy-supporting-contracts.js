const { ethers } = require("hardhat");

require("dotenv").config();

const { mainnet: addresses } = require('../addresses');

async function main() {

    const provider = new ethers.providers.getDefaultProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); 
    // first WETH
    let { bytecode } = require("../artifacts/contracts/WETH.sol/WETH.json");
    const Weth = await ethers.getContractFactory("WETH", bytecode, wallet);
    const weth = await Weth.deploy();
    console.log(
        `Deployed WETH address: ${weth.address}`
      );

         console.log("Account balance:", (await wallet.getBalance()).toString());
  

    bytecode = require("../artifacts/contracts/uniswapv2/UniswapV2Router02.sol/UniswapV2Router02.json");

    const SushiswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02", bytecode, wallet);
    // const deployTransaction = await SushiswapV2Router02.getDeployTransaction(addresses.sushiswap.factory, weth.address,{
    //     gasLimit: 12000000000
    // })
    // // const sushiswapRouter = await SushiswapV2Router02.deploy(addresses.sushiswap.factory, weth.address);
    // const transaction = await wallet.sendTransaction(deployTransaction);
    const sushiRouter = SushiswapV2Router02.attach(addresses.sushiswap.factory);

    console.log("Account balance:", (await wallet.getBalance()).toString());
  
    // console.log(
    //     `Deployed SushiSwap Router address: ${transaction}`
    //   );
    // console.log("Account balance:", (await wallet.getBalance()).toString());
}

main();