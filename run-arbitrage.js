require("dotenv").config();
const { ethers } = require("ethers");

const url = process.env.NODE_URL;
const provider = new ethers.providers.JsonRpcProvider(url);

const init = async () => {

    provider.on('block', async (blockNumber) => {
        console.log('New Block: ' + blockNumber);
    });
    
}

init();
