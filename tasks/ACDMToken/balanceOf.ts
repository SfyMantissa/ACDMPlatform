import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ACDMToken } from "../../deployments.json";

task("acdmBalanceOf",
  "Get the balance of the account")
  .addParam("account", "User's address")
  .setAction(async (args, { ethers }) => {
    const acdmToken = await ethers.getContractAt("ACDMToken", ACDMToken.address);
    const balanceOf = await acdmToken.balanceOf(args.account);
    const name = await acdmToken.name();
    console.log(args.account + ' has ' + balanceOf + name + ' tokens.');
  });
