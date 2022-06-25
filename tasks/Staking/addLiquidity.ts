import IUniswapV2Router02 from '../../abi/router02_abi.json';
import IUniswapV2Factory from '../../abi/factory_abi.json';
import IUniswapV2Pair from '../../abi/pair_abi.json';
import ERC20Token from '../../abi/erc20_abi.json';

import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("addLiquidity",
  "Symmetrically add a specified amount of token0 and token1 to the "
  + "Uniswap V2 testnet liquidity pool (creates a pool if it doesn't exist).")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("amount", "Amount of tokens to symmetrically add to the pool.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();

    let afterMinute = new Date().getTime() + 60;

    const xxxToken = new ethers.Contract(
      config.XXXTOKEN_ADDRESS,
      ERC20Token.abi,
      signerArray[args.signer]
    );

    const symbol = await xxxToken.symbol();

    await xxxToken.connect(signerArray[args.signer]).approve(config.ROUTER02_ADDRESS, args.amount);

    const router02 = new ethers.Contract(
      config.ROUTER02_ADDRESS,
      IUniswapV2Router02.abi,
      signerArray[args.signer]
    );

    const factory = new ethers.Contract(
      config.FACTORY_ADDRESS,
      IUniswapV2Factory.abi,
      signerArray[args.signer]
    );

    await router02.connect(signerArray[args.signer]).addLiquidityETH(
      config.XXXTOKEN_ADDRESS,
      args.amount,
      args.amount,
      args.amount,
      signerArray[args.signer].address,
      afterMinute,
      { value: ethers.utils.parseUnits(args.amount, 13) }
    );

    const pairAddress = await factory.getPair(
      config.XXXTOKEN_ADDRESS,
      await router02.WETH()
    );

    const pair = new ethers.Contract(
      pairAddress,
      IUniswapV2Pair.abi,
      signerArray[args.signer]
    );

    const pairReserves = await pair.getReserves();
    console.log(await pair.balanceOf(signerArray[args.signer].address));

    console.log(
      "Successfully added " + args.amount
      + " of " + symbol
      + " and WETH"
      + " tokens to " + symbol
      + "/WETH"
      + " liquidity pool." + "\n" + symbol
      + " tokens in " + symbol
      + "/WETH"
      + " liquidity pool: " + pairReserves[0]
      + ".\nWETH"
      + " in " + symbol
      + "/WETH"
      + " liquidity pool: " + pairReserves[1]
      + ".\nPair address: " + pairAddress + '.'
    );
  });
