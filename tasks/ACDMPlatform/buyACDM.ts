import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("buyACDM",
  "Allow the caller to buy ACDM tokens.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("ether", "Ether to send.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmPlatform = await ethers.getContractAt("ACDMPlatform", config.ACDMPLATFORM_ADDRESS);

    const etherToWei = ethers.utils.parseEther(args.ether);
    const txBuyACDM = acdmPlatform.connect(signerArray[args.signer]).buyACDM({ value: etherToWei });
    const rBuyACDM = await (await txBuyACDM).wait();

    const user = rBuyACDM.events[1].args[0];
    const amount = rBuyACDM.events[1].args[1];

    console.log("User " + user + " bought " + amount + " of ACDM for " + args.ether + " ETH.");
  });
