pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWeth.sol";
import "hardhat/console.sol";


contract SwapTest {
    address public factory;
    uint constant deadline = 10 days;
    IUniswapV2Router02 public sushiRouter;

    address owner = msg.sender;
    IUniswapV2Router02 uniswap;
    IERC20 weth;
    IERC20 link;

    constructor(address _factory, address _sushiRouter) public {
        factory = _factory;  
        sushiRouter = IUniswapV2Router02(_sushiRouter);
    }

    function exchangeSushiswap(uint amountToken, uint amountRequired, address[] memory path) public payable {
        console.log("DEBUG: msg.value: %s", amountToken);
        console.log("DEBUG: path[0]: %s", path[0]);
        console.log("DEBUG: path[1] %s", path[1]);
        console.log("DEBUG: amountRequired %s", amountRequired);
        console.log("DEBUG: msg.sender %s:", msg.sender);
        console.log("DEBUG: contract amount: %s", address(this).balance);


        uint amountReceived = sushiRouter.swapExactETHForTokens.value(address(this).balance)(
        amountRequired, 
        path, 
        msg.sender, 
        deadline
        )[1];

        console.log("amountReceived: %s");
    }
 

    fallback() external payable {}
}