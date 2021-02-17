pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWeth.sol";


contract SwapTest {
    address public factory;
    uint constant deadline = 10 days;
    IUniswapV2Router02 public sushiRouter;

    address owner = msg.sender;
    IUniswapV2Router02 uniswap;
    IERC20 weth;

    constructor(address _factory, address _sushiRouter) public {
        factory = _factory;  
        sushiRouter = IUniswapV2Router02(_sushiRouter);
    }

    function exchangeSushiswap(uint amountToken, uint amountRequired, address[] memory path) public {
        uint amountReceived = sushiRouter.swapExactTokensForTokens(
        amountToken, 
        amountRequired, 
        path, 
        address(this), 
        deadline
        )[1];
    }

    fallback() external payable {}
}