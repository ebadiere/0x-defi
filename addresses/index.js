const kyberMainnet = require('./kyber-mainnet.json');
const uniswapMainnet = require('./uniswap-mainnet.json');
const sushiswapMainnet = require('./sushiswap-mainnet.json');
const dydxMainnet = require('./dydx-mainnet.json');
const tokensMainnet = require('./tokens-mainnet.json');

const kyberRopsten = require('./kyber-ropsten.json');
const uniswapRopsten = require('./uniswap-ropsten.json');
const tokensRopsten = require('./tokens-ropsten.json');

const kyberKovan = require('./kyber-kovan.json');
const uniswapKovan = require('./uniswap-kovan.json');
const tokensKovan = require('./tokens-kovan.json');


module.exports = {
  mainnet: {
    kyber: kyberMainnet,
    uniswap: uniswapMainnet,
    sushiswap: sushiswapMainnet,
    dydx: dydxMainnet,
    tokens: tokensMainnet
  },
  ropsten: {
    kyber: kyberRopsten,
    uniswap: uniswapRopsten,
    tokens: tokensRopsten
  },
  kovan: {
    kyber: kyberKovan,
    uniswap: uniswapKovan,
    tokens: tokensKovan
  }
};
