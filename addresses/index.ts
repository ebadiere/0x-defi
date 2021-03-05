import kyberMainnet from'./kyber-mainnet.json';
import uniswapMainnet from'./uniswap-mainnet.json';
import sushiswapMainnet from'./sushiswap-mainnet.json';
import dydxMainnet from'./dydx-mainnet.json';
import tokensMainnet from'./tokens-mainnet.json';

import kyberRopsten from './kyber-ropsten.json';
import uniswapRopsten from './uniswap-ropsten.json';
import tokensRopsten from'./tokens-ropsten.json';

import kyberKovan from'./kyber-kovan.json';
import uniswapKovan from'./uniswap-kovan.json';
import tokensKovan from'./tokens-kovan.json';
import sushiswapKovan from'./sushiswap-kovan.json';



export const mainnet = {
    kyber: kyberMainnet,
    uniswap: uniswapMainnet,
    sushiswap: sushiswapMainnet,
    dydx: dydxMainnet,
    tokens: tokensMainnet
};
export const ropsten = {
    kyber: kyberRopsten,
    uniswap: uniswapRopsten,
    tokens: tokensRopsten
};
export const kovan = {
    kyber: kyberKovan,
    sushiswap: sushiswapKovan,
    uniswap: uniswapKovan,
    tokens: tokensKovan
};



