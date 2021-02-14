const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Swap test", function() {
    let Swap1Inch, swap1Inch;
    const ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
 
    const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const WALLET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    beforeEach(async () => {
        // const accounts = await ethers.getSigners();
        // const provider = ethers.getDefaultProvider();
        // const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        // console.log('Before deploy: ');
        // let balance = await wallet.getBalance().then((balance) => {
        //     // console.log(balance);
        //     return balance;
        //     }
        // );
        // console.log(`Wallet address: ${wallet.address}`);
        // console.log(`Wallet balance: ${balance}`);
        const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        SwapTest = await ethers.getContractFactory('SwapTest');
        swapTest = await SwapTest.deploy(uniswapRouter, weth);
        // console.log(`After deploy`);
        // balance = await wallet.getBalance().then((balance) => {
        //     // console.log(balance);
        //     return balance;
        //     }
        // );
        // console.log(`Wallet address: ${wallet.address}`);
        // console.log(`Wallet balance: ${balance}`);

    });


    it ("Should send 100 eth to the contract deployed", async function() {

        const url = "http://localhost:8545";
        const provider = new ethers.providers.JsonRpcProvider(url);

        const accounts = await ethers.getSigners();
        for (const account of accounts) {
            console.log(account.address);
            const balance = await account.getBalance();
            console.log(utils.formatEther(balance));
        }
        const signer = accounts[0];

        const transaction = {
            to: swapTest.address,
            value: ethers.utils.parseEther("100")            
        }
            
        console.log(`'Signer: ${signer.address}`);
        let contractBalance = await provider.getBalance(swapTest.address);
        console.log(`Contract balance: ${utils.formatEther(contractBalance)}`);

        const receipt = await signer.sendTransaction(transaction);
        await receipt.wait();
        console.log(`Transaction successful with hash: ${receipt.hash}`);

        const gasCost = receipt.gasPrice * receipt.gasLimit;
        console.log(`Tranaction gas cost: ${utils.formatEther(gasCost)}`);
        
        contractBalance = await provider.getBalance(swapTest.address);
        console.log(`Contract balance: ${utils.formatEther(contractBalance)}`);
        expect(utils.formatEther(contractBalance)).to.equal("100.0");

    })
});