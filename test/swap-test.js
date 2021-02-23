const { expect } = require("chai");
const { Contract, providers } = require("ethers");
const { utils } = require("ethers");
const { ethers } = require("hardhat");
const { mainnet: addresses } = require('../addresses');
const abis = require('../abis');
require("@tenderly/hardhat-tenderly");

// const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Swap test", function() {
    
    const ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
 
    const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const WALLET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    beforeEach(async () => {
 
    });


    xit ("Should run a swap on sushiswap", async function() {

        const { ChainId, Fetcher, TokenAmount } = require('@sushiswap/sdk');

        const url = "http://localhost:8545";
        const provider = new ethers.providers.JsonRpcProvider(url);
        // const provider = new ethers.providers.getDefaultProvider();
        const SwapTest = await ethers.getContractFactory('SwapTest');
        const swapTest = await SwapTest.deploy(addresses.uniswap.factory, addresses.sushiswap.router);
        console.log(`Deployed: address: ${swapTest.address}`);
 
        const accounts = await ethers.getSigners();
 
        const signer = accounts[0];

        const transaction = {
            to: swapTest.address,
            value: ethers.utils.parseEther("100")            
        }
            
        console.log(`Signer: ${signer.address}`);

        const receipt = await signer.sendTransaction(transaction);
        await receipt.wait();
        console.log(`Transaction successful with hash: ${receipt.hash}`);

        const { amountOutMinHex, path, deadlineHex } = await prepareSwap(Fetcher, ChainId, TokenAmount);
        await swapTest.exchangeSushiswap(
            ethers.utils.parseEther("100"),
            amountOutMinHex,
            path
        );
        console.log(`DEBUG: after call to swp:`);

        let contractBalance = await provider.getBalance(swapTest.address);
        console.log(`Contract balance: ${utils.formatEther(contractBalance)}`);

        // const receipt = await signer.sendTransaction(transaction);
        // await receipt.wait();
        // console.log(`Transaction successful with hash: ${receipt.hash}`);

        // const gasCost = receipt.gasPrice * receipt.gasLimit;
        // console.log(`Tranaction gas cost: ${utils.formatEther(gasCost)}`);
        
        // contractBalance = await provider.getBalance(swapTest.address);
        // console.log(`Contract balance: ${utils.formatEther(contractBalance)}`);
        // expect(utils.formatEther(contractBalance)).to.equal("100.0");

    });

    it ("Should estimate the gas cost of the flashloan and execute trade", async function() {
 
        // const provider = new ethers.providers.getDefaultProvider();
        const url = "http://localhost:8545";
        const provider = new ethers.providers.JsonRpcProvider(url);

        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
      
        console.log(
          "Deploying contracts with the account:",
          wallet.address
        );
        
        console.log("Account balance:", (await wallet.getBalance()).toString());
        const Arbitrage = await ethers.getContractFactory('Arbitrage');
        const arbitrage = await Arbitrage.deploy(addresses.uniswap.factory, addresses.sushiswap.router);
 
        console.log(`Contract Address: ${arbitrage.address}`);
        // const accounts = await ethers.getSigners();
        // const signer = accounts[0];
        // arbitrage.connect(signer);
 

        let txn = await arbitrage.populateTransaction.startArbitrage(
            addresses.tokens.weth,
            addresses.tokens.link,
            ethers.BigNumber.from(ethers.utils.parseEther("100").toString()).toHexString(),
            ethers.BigNumber.from(ethers.utils.parseEther("0").toString()).toHexString(),{
                from: wallet.address
            }
        ).catch(error => {
            console.log(error);
        });


        console.log(`txn: ${JSON.stringify(txn)}`);
        await provider.estimateGas(txn).then(function(estimate) {
            console.log(`estimate: ${estimate}`);
        });
        // expect(estimatedGas).to.equal("22128");

        //  // update to set gas limit then upload to tenderly
        // console.log(`DEBUG: estimateGas: ${Math.trunc(estimatedGas * 110 / 100)}`);
        // const gasIncreased = Math.trunc(estimatedGas * 160 / 100);
        // console.log('DEBUG: Gas in wei: ${}')
        const gasPrice = await provider.getGasPrice();
        // const inWei = ethers.utils.parseUnits(gasIncreased.toString(), 'gwei');
        // console.log(`DEBUG: gasPrice: ${inWei}`);

        const tx = await arbitrage.startArbitrage(
            addresses.tokens.weth,
            addresses.tokens.link,
            ethers.BigNumber.from(ethers.utils.parseEther("100").toString()).toHexString(),
            ethers.BigNumber.from(ethers.utils.parseEther("0").toString()).toHexString(),{
                gasLimit: 1000000,
                gasPrice: gasPrice,
                from: wallet.address
            }
        ).catch(error => {
            console.log(error);
        });

        // console.log(`Transaction: ${tx.hash}`);
        const linkContract = new Contract(addresses.tokens.link, abis.tokens.erc20, wallet);
        const balance = await linkContract.balanceOf(wallet.address);
        console.log(`Link: ${balance}`);       

    });

    xit ("Should be able to execute a trade on the sushiswap contract", async () => {

        const { ChainId, Fetcher, TokenAmount } = require('@sushiswap/sdk');

        const provider = new ethers.providers.getDefaultProvider();
        
        const sushiABI = abis.sushi.sushiswap;
 
        // extract this into reusable functions to test the contract call
        const accounts = await getAccounts();
        const signer = accounts[0];  
        const sushiRouter = new ethers.Contract(addresses.sushiswap.router, sushiABI, signer);


 
        const { amountOutMinHex, path, deadlineHex } = await prepareSwap(Fetcher, ChainId, TokenAmount);
    
        const tx = await sushiRouter.swapExactETHForTokens(
            amountOutMinHex,
            path,
            signer.address,
            deadlineHex,{
                value: ethers.utils.parseEther("100"),

            }
        ).catch(error => {
            console.log(error);
        });
        
        const linkContract = new Contract(addresses.tokens.link, abis.tokens.erc20, signer);
        const balance = await linkContract.balanceOf(signer.address);
        console.log(`Link: ${balance}`);
   

    });

    
});

async function prepareSwap(Fetcher, ChainId, TokenAmount) {
    const [weth, link] = await Promise.all(
        [addresses.tokens.weth, addresses.tokens.link].map(tokenAddress => (
            Fetcher.fetchTokenData(
                ChainId.MAINNET,
                tokenAddress
            )
        )
        ));

    const wethLink = await Fetcher.fetchPairData(
        weth,
        link
    );

    const uniswapOutToken = await wethLink.getOutputAmount(new TokenAmount(weth, ethers.utils.parseEther("100")));
    const uniswapOutTokenAmount = uniswapOutToken[0].raw.toString();
    console.log(`uniswap outToken: ${uniswapOutTokenAmount}`);
    const amountOutMinHex = ethers.BigNumber.from(uniswapOutTokenAmount.toString()).toHexString();
    const path = [addresses.tokens.weth, addresses.tokens.link];

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
