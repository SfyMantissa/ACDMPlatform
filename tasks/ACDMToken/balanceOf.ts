import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("acdmBalanceOf",
  "Get the balance of the account")
  .addParam("account", "User's address")
  .setAction(async (args, { ethers }) => {
    const acdmToken = await ethers.getContractAt("ACDMToken", config.ACDMTOKEN_ADDRESS);
    const balanceOf = await acdmToken.balanceOf(args.account);
    const name = await acdmToken.name();
    console.log(args.account + ' has ' + balanceOf + name + ' tokens.');
  });
