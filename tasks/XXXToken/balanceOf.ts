import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { XXXToken } from "../../deployments.json";

task("xxxBalanceOf",
  "Get the balance of the account")
  .addParam("account", "User's address")
  .setAction(async (args, { ethers }) => {
    const xxxToken = await ethers.getContractAt("XXXToken", XXXToken.address);
    const balanceOf = await xxxToken.balanceOf(args.account);
    const name = await xxxToken.name();
    console.log(args.account + ' has ' + balanceOf + name + ' tokens.');
  });
