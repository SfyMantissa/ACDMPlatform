import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../../config';

task("vote",
  "Vote for a proposal.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("proposalId", "Proposal ID.")
  .addParam("decision", "Whether you vote `for` (true) or `against` (false).")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const daoVoting = await ethers.getContractAt("DAOVoting", config.DAO_ADDRESS);

    let isFor = (args.decision === 'true');
    const txVote = daoVoting.connect(
      signerArray[args.signer]).vote(
        args.proposalId,
        isFor
      );

    const rVote = await (await txVote).wait();

    const proposalId = rVote.events[0].args[0];
    const voter = rVote.events[0].args[1];
    const decision = rVote.events[0].args[2];
    const votes = rVote.events[0].args[3];

    console.log("Casted a vote for a proposal with ID " + proposalId + ":"
      + "\n-------------------------"
      + "\nVoter: " + voter
      + "\nVoted `for`: " + decision
      + "\nVotes: " + votes
    );
  });

