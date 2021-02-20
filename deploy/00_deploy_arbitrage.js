// deploy/00_deploy_my_contract.js
// to be used later start with simple script
const { kovan: addresses } = require('../addresses');
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    console.log("Deploying contract");
    await deploy('Arbitrage', {
      from: deployer,
      args: ['addresses.uniswap.factory', 'addresses.sushiswap.router'],
      log: true,
    });
  };
  module.exports.tags = ['Arbitrage']