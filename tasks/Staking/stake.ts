import IUniswapV2Pair from '../../abi/pair_abi.json';
import { MerkleTree } from "merkletreejs";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

import keccak256 from "keccak256";
import config from '../../config';

task("stake",
  "Allows the caller to stake `amount` of tokens to the staking contract"
  + "(approval is performed automatically).")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("amount", "Number of tokens to be staked.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const staking = await ethers.getContractAt("Staking", config.STAKING_ADDRESS);

    const liquidityToken = new ethers.Contract(
      config.LIQUIDITY_TOKEN_ADDRESS,
      IUniswapV2Pair.abi,
      signerArray[args.signer]
    );

    const leafNodes = config.MERKLE_ADDRESSES.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const proof = merkleTree.getHexProof(keccak256(signerArray[args.signer].address));

    await liquidityToken.connect(signerArray[args.signer])
      .approve(config.STAKING_ADDRESS, args.amount);

    const txStake = staking.connect(signerArray[args.signer])
      .stake(args.amount, proof);
    const rStake = await (await txStake).wait();

    const caller = rStake.events[1].args[0];
    const amount = rStake.events[1].args[1];

    console.log(caller + ' staked ' + amount + ' liquidity tokens.');
  });
