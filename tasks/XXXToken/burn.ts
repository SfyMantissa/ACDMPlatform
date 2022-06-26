import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("xxxBurn",
  "Allows the caller to burn the specified `amount` of tokens from the `account` and decrease the `_totalSupply by the `amount`.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("account", "Address of the burned account.")
  .addParam("amount", "Number of tokens to be burned.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const xxxToken = await ethers.getContractAt("XXXToken", config.XXXTOKEN_ADDRESS);
    const txBurn = xxxToken.connect(signerArray[args.signer]).burn(args.account, args.amount);
    const rBurn = await (await txBurn).wait();

    const account = rBurn.events[0].args[0];
    const amount = rBurn.events[0].args[2];
    const totalSupply = await xxxToken.totalSupply();

    console.log(account + ' had ' + amount + ' of tokens burned. Total supply is now ' + totalSupply + '.');
  });
