import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("acdmMint",
  "Allows the caller to give the specified `amount` of tokens to the `account` and increase `_totalSupply` by the `amount`.")
  .addParam("account", "Address of the recepient.")
  .addParam("amount", "Number of tokens to be transferred.")
  .setAction(async (args, { ethers }) => {
    const acdmToken = await ethers.getContractAt("ACDMToken", config.ACDMTOKEN_ADDRESS);
    const txMint = acdmToken.mint(args.account, args.amount);
    const rMint = await (await txMint).wait();

    const account = rMint.events[0].args[1];
    const amount = rMint.events[0].args[2];
    const totalSupply = await acdmToken.totalSupply();

    console.log(account + ' had ' + amount + ' of tokens minted. Total supply is now ' + totalSupply + '.');
  });
