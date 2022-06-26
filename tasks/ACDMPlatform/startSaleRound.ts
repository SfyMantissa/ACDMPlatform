import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("startSaleRound",
  "Allow the caller to start the sale round.")
  .addParam("signer", "ID of the signer used to make the call.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmPlatform = await ethers.getContractAt("ACDMPlatform", config.ACDMPLATFORM_ADDRESS);

    const txStartSaleRound = acdmPlatform.connect(signerArray[args.signer]).startSaleRound();
    const rStartSaleRound = await (await txStartSaleRound).wait();

    const caller = signerArray[args.signer].address;
    const endTime = rStartSaleRound.events[1].args[0];
    const type = rStartSaleRound.events[1].args[1];

    console.log(caller + " started the round."
      + "\nType: " + type
      + "\nEnd timestamp: " + endTime
    );
  });
