import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("xxxMint",
  "Allows the caller to give the specified `amount` of tokens to the `account` and increase `_totalSupply` by the `amount`.")
  .addParam("account", "Address of the recepient.")
  .addParam("amount", "Number of tokens to be transferred.")
  .setAction(async (args, { ethers }) => {
    const xxxToken = await ethers.getContractAt("XXXToken", config.XXXTOKEN_ADDRESS);
    const txMint = xxxToken.mint(args.account, args.amount);
    const rMint = await (await txMint).wait();

    const account = rMint.events[0].args[1];
    const amount = rMint.events[0].args[2];
    const totalSupply = await xxxToken.totalSupply();

    console.log(account + ' had ' + amount + ' of tokens minted. Total supply is now ' + totalSupply + '.');
  });
