import ERC20Token from "../abi/erc20_abi.json";
import IUniswapV2Factory from '../abi/factory_abi.json';
import IUniswapV2Router02 from "../abi/router02_abi.json";
import IUniswapV2Pair from '../abi/pair_abi.json';

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ethers } from "hardhat";
import config from "../config";

export const addLiquidity = async (
  staking: Contract,
  signer: SignerWithAddress,
  provideAmount: number,
  ltAmount: number
) => {
  let afterMinute = new Date().getTime() + 60;

  const xxxToken = new ethers.Contract(
    config.XXXTOKEN_ADDRESS,
    ERC20Token.abi,
    signer
  );

  await xxxToken
    .connect(signer)
    .approve(config.ROUTER02_ADDRESS, provideAmount);

  const router02 = new ethers.Contract(
    config.ROUTER02_ADDRESS,
    IUniswapV2Router02.abi,
    signer
  );

  const factory = new ethers.Contract(
    config.FACTORY_ADDRESS,
    IUniswapV2Factory.abi,
    signer
  );

  await router02
    .connect(signer)
    .addLiquidityETH(
      config.XXXTOKEN_ADDRESS,
      provideAmount,
      provideAmount,
      provideAmount,
      signer.address,
      afterMinute,
      { value: ethers.utils.parseUnits(provideAmount.toString(), 13) }
    );

  const liquidityTokenAddress = await factory.getPair(
    config.XXXTOKEN_ADDRESS,
    await router02.WETH()
  );

  const liquidityToken = new ethers.Contract(
    liquidityTokenAddress,
    IUniswapV2Pair.abi,
    signer
  );

  await liquidityToken.connect(signer).approve(staking.address, ltAmount);
};
