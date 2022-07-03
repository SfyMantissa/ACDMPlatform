import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { Staking } from "../../deployments.json";

task("stakeOf",
  "Get the stake information for the account.")
  .addParam("account", "User's address")
  .setAction(async (args, { ethers }) => {
    const staking = await ethers.getContractAt("Staking", Staking.address);
    const stakeOf = await staking.stakeOf(args.account);
    console.log(args.account + ' has:\n'
      + stakeOf[0] + ' liquidity tokens staked.\n'
      + stakeOf[1] + ' last stake start timestamp.\n'
      + stakeOf[2] + ' current stake end timestamp.\n'
      + stakeOf[3] + ' last time claimed the reward.'
    );
  });
