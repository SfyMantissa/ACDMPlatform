import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("xxxBalanceOf",
  "Get the balance of the account")
  .addParam("account", "User's address")
  .setAction(async (args, { ethers }) => {
    const xxxToken = await ethers.getContractAt("XXXToken", config.XXXTOKEN_ADDRESS);
    const balanceOf = await xxxToken.balanceOf(args.account);
    const name = await xxxToken.name();
    console.log(args.account + ' has ' + balanceOf + name + ' tokens.');
  });
