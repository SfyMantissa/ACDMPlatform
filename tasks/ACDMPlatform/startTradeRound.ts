import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ACDMPlatform } from "../../deployments.json";

task("startTradeRound",
  "Allow the caller to start the trade round.")
  .addParam("signer", "ID of the signer used to make the call.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmPlatform = await ethers.getContractAt("ACDMPlatform", ACDMPlatform.address);

    const txStartTradeRound = acdmPlatform.connect(signerArray[args.signer]).startTradeRound();
    const rStartTradeRound = await (await txStartTradeRound).wait();

    const caller = signerArray[args.signer].address;
    const endTime = rStartTradeRound.events[1].args[0];
    const type = rStartTradeRound.events[1].args[1];

    console.log(caller + " started the round."
      + "\nType: " + type
      + "\nEnd timestamp: " + endTime
    );
  });
