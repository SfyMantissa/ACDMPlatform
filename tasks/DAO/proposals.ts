import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { DAOVoting } from "../../deployments.json";

task("proposals",
  "Get the proposal info by ID.")
  .addParam("proposalId", "The proposal's ID.")
  .setAction(async (args, { ethers }) => {
    const daoVoting = await ethers.getContractAt("DAOVoting", DAOVoting.address);
    const proposal = await daoVoting.proposals(args.proposalId);

    console.log("Proposal with ID " + args.proposalId + " data."
      + "\n-------------------------"
      + "\nStart UNIX timestamp: " + proposal.startTimeStamp + "."
      + "\nTotal vote count: " + proposal.voteCount + "."
      + "\nPositive vote count: " + proposal.positiveVoteCount + "."
      + "\nIs finished: " + proposal.isFinished + "."
      + "\nBytes used for call in case of success: " + proposal.callData + "."
      + "\nRecipient address in case of success: " + proposal.recipient + "."
      + "\nDescription: " + proposal.description
    );
  });

