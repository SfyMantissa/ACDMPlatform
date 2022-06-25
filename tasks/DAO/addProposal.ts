import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("addProposal",
  "Add a new proposal voting.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("calldata", "Signature of the function to call.")
  .addParam("recipient", "Address of call recipient.")
  .addParam("description", "Proposal description.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const daoVoting = await ethers.getContractAt("DAOVoting", config.DAO_ADDRESS);

    const txAddProposal = daoVoting.connect(
      signerArray[args.signer]).addProposal(
        args.calldata,
        args.recipient,
        args.description
      );

    const rAddProposal = await (await txAddProposal).wait();

    const proposalId = rAddProposal.events[0].args[0];
    const description = rAddProposal.events[0].args[1];
    const startTimeStamp = rAddProposal.events[0].args[2];
    const recipient = rAddProposal.events[0].args[3];

    console.log("Created a new proposal with ID " + proposalId + ":"
      + "\n-------------------------"
      + "\nDescription: " + description
      + "\nStart UNIX timestamp: " + startTimeStamp
      + "\nRecipient address in case of success: " + recipient
      + "\nBytes used for call in case of success: " + args.calldata
    );
  });

