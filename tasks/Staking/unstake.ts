import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("unstake",
  "Allows the caller to unstake the tokens from the staking contract.")
  .addParam("signer", "ID of the signer used to make the call.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const staking = await ethers.getContractAt("Staking", config.STAKING_ADDRESS);

    const txUnstake = staking.connect(signerArray[args.signer]).unstake();
    const rUnstake = await (await txUnstake).wait();

    const caller = rUnstake.events[1].args[0];
    const amount = rUnstake.events[1].args[1];

    console.log(caller + ' unstaked ' + amount + ' liquidity tokens.');
  });
