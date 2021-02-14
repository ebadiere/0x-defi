pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IUniswapV2Router02.sol";
import "./IWeth.sol";


contract SwapTest {
    address owner = msg.sender;
    IUniswapV2Router02 uniswap;
    IERC20 weth;

    constructor(
        address uniswapAddress,
        address wethAddress
    ) public payable {
        uniswap = IUniswapV2Router02(uniswapAddress);
        weth = IERC20(wethAddress);       
    }

    fallback() external payable {}
}