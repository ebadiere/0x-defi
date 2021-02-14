require("dotenv").config();
const { ethers } = require("ethers");

const abis = require('./abis');
const { mainnet: addresses } = require('./addresses');

const url = process.env.NODE_URL;
const provider = new ethers.providers.JsonRpcProvider(url);

const AMOUNT_WETH_WEI = ethers.utils.parseEther("100");

const queryUniswap = async () => {
    const { ChainId, Fetcher, TokenAmount } = require('@uniswap/sdk');
    const [weth, link] = await Promise.all(
        [addresses.tokens.weth, addresses.tokens.link].map(tokenAddress => (
            Fetcher.fetchTokenData(
                ChainId.MAINNET,
                tokenAddress,
            )
        )
    ));

    const wethLink = await Fetcher.fetchPairData(
        weth,
        link,
    );

    const uniswapOutToken = await wethLink.getOutputAmount(new TokenAmount(weth, AMOUNT_WETH_WEI));
    const uniswapOutTokenAmount = uniswapOutToken[0].raw.toString();
    console.log(`uniswap outToken: ${uniswapOutTokenAmount}`);
    return uniswapOutTokenAmount;
}

const querySushiswap = async (amount) => {
    const { ChainId, Fetcher, TokenAmount } = require('@sushiswap/sdk');
    const [link, weth] = await Promise.all(
        [addresses.tokens.link, addresses.tokens.weth].map(tokenAddress => (
            Fetcher.fetchTokenData(
                ChainId.MAINNET,
                tokenAddress,
            )
        )
    ));

    const linkWeth = await Fetcher.fetchPairData(
        link,
        weth,
    );   
    
    const sushiswapOutToken = await linkWeth.getOutputAmount(new TokenAmount(link, amount));
    const sushiswapOutTokenAmount = sushiswapOutToken[0].raw.toString();
    console.log(`sushiswap outToken: ${sushiswapOutTokenAmount}`);
    return sushiswapOutTokenAmount;
    
}

const init = async () => {

    provider.on('block', async (blockNumber) => {
        console.log('New Block: ' + blockNumber);
        const uniswapOutAmount = await queryUniswap();
        await querySushiswap(uniswapOutAmount);
    });
    
}

init();
