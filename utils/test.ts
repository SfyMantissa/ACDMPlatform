import IUniswapV2Router02 from '../abi/router02_abi.json';
import ERC20Token from '../abi/erc20_abi.json';
import config from '../config';

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

const test = async () => {
  const signer = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(signer[0].address);

  const router02 = new ethers.Contract(
    config.ROUTER02_ADDRESS,
    IUniswapV2Router02.abi,
    signer[0]
  );

  console.log(await router02.getAmountsOut(balance, [config.WETH_ADDRESS, config.XXXTOKEN_ADDRESS]));
}

test()
