import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ACDMPlatform } from "../../deployments.json";

task("register",
  "Allow the caller to register, providing referer information.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("referer", "Referer address.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmPlatform = await ethers.getContractAt("ACDMPlatform", ACDMPlatform.address);

    const txRegister = acdmPlatform.connect(signerArray[args.signer]).register(args.referer);
    const rRegister = await (await txRegister).wait();

    const user = rRegister.events[1].args[0];
    const referer = rRegister.events[1].args[1];

    console.log("User " + user + " registered with referer " + referer + ".");
  });
