import ERC20Token from "../abi/erc20_abi.json";
import IUniswapV2Factory from '../abi/factory_abi.json';
import IUniswapV2Router02 from "../abi/router02_abi.json";
import IUniswapV2Pair from '../abi/pair_abi.json';

import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import keccak256 from "keccak256";
import { ethers } from "hardhat";
import { XXXToken, Staking } from "../deployments.json";

export const addLiquidity = async (
  staking: Contract,
  signer: SignerWithAddress,
  provideAmount: number,
  ltAmount: number
) => {
  let afterMinute = new Date().getTime() + 60;

  const xxxToken = new ethers.Contract(
    XXXToken.address,
    ERC20Token.abi,
    signer
  );

  await xxxToken
    .connect(signer)
    .approve(Staking.router02, provideAmount);

  const router02 = new ethers.Contract(
    Staking.router02,
    IUniswapV2Router02.abi,
    signer
  );

  const factory = new ethers.Contract(
    Staking.factory,
    IUniswapV2Factory.abi,
    signer
  );

  await router02
    .connect(signer)
    .addLiquidityETH(
      XXXToken.address,
      provideAmount,
      provideAmount,
      provideAmount,
      signer.address,
      afterMinute,
      { value: ethers.utils.parseUnits(provideAmount.toString(), 13) }
    );

  const liquidityTokenAddress = await factory.getPair(
    XXXToken.address,
    await router02.WETH()
  );

  const liquidityToken = new ethers.Contract(
    liquidityTokenAddress,
    IUniswapV2Pair.abi,
    signer
  );

  await liquidityToken.connect(signer).approve(staking.address, ltAmount);
};

export const buildTree = (addresses: string[]) => {
  const leafNodes = addresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  return merkleTree;
};

export const getProof = (merkleTree: MerkleTree, address: string) => {
  return merkleTree.getHexProof(keccak256(address));
}

export const getRoot = (merkleTree: MerkleTree) => {
  return "0x".concat(merkleTree.getRoot().toString("hex"));
}

const main = () => {
  const merkleTree = buildTree(Staking.merkleAddresses);
  console.log("Merkle tree:\n" + merkleTree.toString());

  const root = merkleTree.getRoot().toString("hex");
  console.log("Merkle tree root: " + "0x".concat(root));
}

if (require.main === module) {
  main();
}
