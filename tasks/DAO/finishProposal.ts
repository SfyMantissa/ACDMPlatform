import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("finishProposal",
  "Finish a proposal with a given ID.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("proposalId", "Proposal ID.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const daoVoting = await ethers.getContractAt("DAOVoting", config.DAO_ADDRESS);

    const txFinishProposal = daoVoting.connect(
      signerArray[args.signer]).finishProposal(
        args.proposalId
      );

    const rFinishProposal = await (await txFinishProposal).wait();

    const minimumQuorum = await daoVoting.minimumQuorum();

    const proposalId = rFinishProposal.events[0].args[0];
    const description = rFinishProposal.events[0].args[1];
    const decision = rFinishProposal.events[0].args[2];
    const positiveVoteCount = rFinishProposal.events[0].args[3];
    const voteCount = rFinishProposal.events[0].args[4];
    const minimumQuorumMet = Boolean(Number(voteCount) > Number(minimumQuorum));

    console.log("Finished a proposal with ID " + proposalId + ":"
      + "\n-------------------------"
      + "\nDescription: " + description
      + "\nAccepted: " + decision
      + "\nTotal votes: " + voteCount
      + "\nPositive votes: " + positiveVoteCount
      + "\nMinimum quorum is met: " + minimumQuorumMet
    );
  });

