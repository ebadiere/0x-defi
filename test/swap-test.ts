import { expect } from 'chai';
import { Contract, providers, PopulatedTransaction, Transaction } from 'ethers';
import { utils } from 'ethers'
import { UnsignedTransaction } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { kovan } from '../addresses/index';
import { erc20 } from '../abis/index';

import { ChainId, Fetcher, Token, TokenAmount, Pair } from '@uniswap/sdk';
import { ChainId as SushiChainId, Fetcher as SushiFetcher, TokenAmount as SushiTokenAmount } from '@sushiswap/sdk';

import * as dotenv from 'dotenv';

dotenv.config();


describe("Swap test", function() {
 
  beforeEach(async () => {});

  it("Should estimate the gas cost of the flashloan and execute trade", async function() {
 
    const url = `${process.env.NODE_URL}`;
 
    const provider = new ethers.providers.AlchemyWebSocketProvider(
      "kovan",
      `${process.env.KEY}`
    );
    const network = await provider.getNetwork();
    console.log(`Provider: ${network.name}`);

    const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

    console.log("Deploying contracts with the account:", wallet.address);

    console.log("Account balance:", (await wallet.getBalance()).toString());
    const Arbitrage = await ethers.getContractFactory("Arbitrage");
    const arbitrage = await Arbitrage.deploy(
      kovan.uniswap.factory,
      kovan.sushiswap.router
    );

    console.log(`Contract Address: ${arbitrage.address}`);

    const { amountOutMinHex, path, deadlineHex} = await prepareSwap();
  

    console.log(`amountOutHex: ${ethers.BigNumber.from(amountOutMinHex)}, path: ${path}, deadlineHex: ${deadlineHex}`);
    //Now with numbers dig into the safe math

    const txn: UnsignedTransaction = await arbitrage.populateTransaction
      .startArbitrage(
        kovan.tokens.weth,
        kovan.tokens.link,
        ethers.BigNumber.from(
          ethers.utils.parseEther("10").toString()
        ).toHexString(),
        ethers.BigNumber.from(
          ethers.utils.parseEther("0").toString()
        ).toHexString()
      );

    console.log(`txn: ${JSON.stringify(txn)}`);
    await provider.estimateGas(txn).then(function(estimate) {
      console.log(`estimate: ${estimate}`);
    });
  
    const gasPrice = await provider.getGasPrice();
 
    const tx = await arbitrage
      .startArbitrage(
        kovan.tokens.weth,
        kovan.tokens.link,
        ethers.BigNumber.from(
          ethers.utils.parseEther("10").toString()
        ).toHexString(),
        ethers.BigNumber.from(
          ethers.utils.parseEther("0").toString()
        ).toHexString(),
        {
          gasLimit: 1000000,
          gasPrice: gasPrice,
        }
      );

    const linkContract = new Contract(
      kovan.tokens.link,
      erc20.erc20,
      wallet
    );
    const balance = await linkContract.balanceOf(wallet.address);
    console.log(`Link: ${balance}`);
    const walletBalance = await wallet.getBalance();
    console.log(`Wallet balance: ${walletBalance}`);
  });

});

// This is Uni, but it's the sushi liquidity we care about
// Create a preapre for sushi and compare both
// work backwards from sushi
// don't delete this
async function prepareSwap() {
  const [weth, link] = await Promise.all(
    [kovan.tokens.weth, kovan.tokens.link].map((tokenAddress) =>
      Fetcher.fetchTokenData(ChainId.KOVAN, tokenAddress)
    )
  );

 
  const wethLink = await Fetcher.fetchPairData(weth, link);

  const tokenAmount: any = TokenAmount;
  const uniswapOutToken = wethLink.getOutputAmount(new tokenAmount(weth, ethers.utils.parseEther('10')));

  const uniswapOutTokenAmount = uniswapOutToken[0].raw.toString();
  console.log(`uniswap outToken: ${uniswapOutTokenAmount}`);

  const amountOutMinHex = ethers.BigNumber.from(
    uniswapOutTokenAmount.toString()
  ).toHexString();
  const path = [kovan.tokens.weth, kovan.tokens.link];

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();

  console.log(`Path: ${path}`);
  return { amountOutMinHex, path, deadlineHex };
}

async function getAccounts() {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
    const balance = await account.getBalance();
    console.log(utils.formatEther(balance));
  }
  return accounts;
}
