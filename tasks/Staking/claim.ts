import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { Staking } from "../../deployments.json";

task("claim",
  "Allows the caller to claim the reward from the staking contract.")
  .addParam("signer", "ID of the signer used to make the call.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const staking = await ethers.getContractAt("Staking", Staking.address);

    const txClaim = staking.connect(signerArray[args.signer]).claim();
    const rClaim = await (await txClaim).wait();

    const caller = rClaim.events[1].args[0];
    const amount = rClaim.events[1].args[1];

    console.log(caller + ' claimed ' + amount + ' reward tokens.');
  });
