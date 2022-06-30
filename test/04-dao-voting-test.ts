import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { ethers } from "hardhat";
import { testDeploy } from "../utils/deploy-utils";
import { addLiquidity, buildTree, getProof, getRoot } from "../utils/staking-utils";

import config from "../config";
import hre from "hardhat";

describe("DAOVoting", () => {
  let daoVoting: Contract;
  let staking: Contract;
  let xxxToken: Contract;
  let xxxAdminAddress: string;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let description1: String;
  let description2: String;
  let merkleTree: MerkleTree;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    xxxAdminAddress = "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF";

    let addresses = [
      owner.address,
      user1.address,
      user2.address
    ];

    merkleTree = buildTree(addresses);

    staking = await testDeploy(
      "Staking",
      getRoot(merkleTree),
      config.LIQUIDITY_TOKEN_ADDRESS,
      config.XXXTOKEN_ADDRESS,
      config.REWARD_PERCENTAGE,
      config.REWARD_INTERVAL,
      config.LOCK_INTERVAL
    );

    daoVoting = await testDeploy(
      "DAOVoting",
      config.LIQUIDITY_TOKEN_ADDRESS,
      staking.address,
      config.MINIMUM_QUORUM,
      config.DEBATING_PERIOD
    );

    xxxToken = await ethers.getContractAt("XXXToken", config.XXXTOKEN_ADDRESS);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [xxxAdminAddress],
    });

    const xxxAdmin = await ethers.getSigner(xxxAdminAddress);

    await xxxToken.connect(xxxAdmin).mint(owner.address, 100000);
    await xxxToken.connect(xxxAdmin).mint(user1.address, 100000);
    await xxxToken.connect(xxxAdmin).mint(user2.address, 100000);
  });

  describe("Before the debating period has passed", () => {
    it("setMinimumQuorum: should revert because caller is not the chairman or DAO.", async () => {
      await expect(
        daoVoting.connect(user1).setMinimumQuorum(245)
      ).to.be.revertedWith("ERROR: Caller is not the chairman or DAO.");
    });

    it("setDebatingPeriodDuration: should revert because caller is not the chairman or DAO.", async () => {
      await expect(
        daoVoting.connect(user1).setDebatingPeriodDuration(2000)
      ).to.be.revertedWith("ERROR: Caller is not the chairman or DAO.");
    });

    it("setMinimumQuorum: should be able to set a new minimumQuorum value.", async () => {
      await daoVoting.connect(owner).setMinimumQuorum(200);
      expect(await daoVoting.connect(owner).minimumQuorum()).to.equal(200);
    });

    it("setDebatingPeriodDuration: should be able to set a new debatingPeriodDuration value.", async () => {
      await daoVoting.connect(owner).setDebatingPeriodDuration(86400);
      expect(await daoVoting.connect(owner).debatingPeriodDuration()).to.equal(
        86400
      );
    });

    it("addProposal: should revert because caller is not the chairman.", async () => {
      const jsonAbi = [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_value",
              type: "uint256",
            },
          ],
          name: "setMinimumQuorum",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const iface = new ethers.utils.Interface(jsonAbi);
      const calldata = iface.encodeFunctionData("setMinimumQuorum", [600]);
      description1 = "Change minimum quorum to 600 votes.";

      await expect(
        daoVoting
          .connect(user1)
          .addProposal(calldata, daoVoting.address, description1)
      ).to.be.revertedWith("ERROR: Caller is not the chairman.");
    });

    it("addProposal: should be able to add a new proposal.", async () => {
      const jsonAbi = [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_value",
              type: "uint256",
            },
          ],
          name: "setMinimumQuorum",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const iface = new ethers.utils.Interface(jsonAbi);
      const calldata = iface.encodeFunctionData("setMinimumQuorum", [600]);
      description1 = "Change minimum quorum to 600 votes.";

      expect(
        await daoVoting
          .connect(owner)
          .addProposal(calldata, daoVoting.address, description1)
      )
        .to.emit(daoVoting, "ProposalAdded")
        .withArgs(1, description1, daoVoting.address);
    });

    it("vote: should revert given a non-exisitng proposal ID.", async () => {
      await expect(daoVoting.connect(owner).vote(20, false)).to.be.revertedWith(
        "ERROR: No proposal with such ID."
      );
    });

    it("vote: should revert given user didn't deposit anything.", async () => {
      await expect(daoVoting.connect(user1).vote(1, false)).to.be.revertedWith(
        "ERROR: No tokens staked."
      );
    });

    it("vote: should be able to case a vote as owner.", async () => {
      await addLiquidity(staking, owner, 5000, 1000);
      const proof = getProof(merkleTree, owner.address);

      await staking.connect(owner).stake(1000, proof);

      expect(await daoVoting.connect(owner).vote(1, true))
        .to.emit(daoVoting, "VoteCasted")
        .withArgs(1, owner.address, true, 1000);
    });

    it("vote: should revert if owner tries to vote again.", async () => {
      await expect(daoVoting.connect(owner).vote(1, false)).to.be.revertedWith(
        "ERROR: You can only vote once."
      );
    });

    it("finishProposal: should revert given a non-existing proposal ID.", async () => {
      await expect(
        daoVoting.connect(owner).finishProposal(20)
      ).to.be.revertedWith("ERROR: No proposal with such ID.");
    });

    it("finishProposal: should revert given debatingPeriodDuration did not pass yet.", async () => {
      await expect(
        daoVoting.connect(owner).finishProposal(1)
      ).to.be.revertedWith(
        "ERROR: Proposal voting cannot be finished prematurely."
      );
    });

    it("vote: should be able to cast a vote as user.", async () => {
      await addLiquidity(staking, user1, 1000, 500);
      const proof = getProof(merkleTree, user1.address);

      await staking.connect(user1).stake(500, proof);

      expect(await daoVoting.connect(user1).vote(1, false))
        .to.emit(daoVoting, "VoteCasted")
        .withArgs(1, user1.address, false, 500);
    });

    describe("After the debating period has passed", () => {
      it("vote: should revert because the proposal voting no longer accepts new votes.", async () => {
        await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

        await addLiquidity(staking, user2, 1000, 700);
        const proof = getProof(merkleTree, user2.address);

        await staking.connect(user2).stake(700, proof);

        expect(daoVoting.connect(user2).vote(1, true)).to.be.revertedWith(
          "ERROR: This proposal voting no longer accepts new votes."
        );
      });

      it("finishProposal: should be able to finish the proposal with a positive decision.", async () => {
        expect(await daoVoting.connect(owner).finishProposal(1))
          .to.emit(daoVoting, "ProposalFinished")
          .withArgs(1, description1, true, 5000, 6000);
        expect(await daoVoting.connect(owner).minimumQuorum()).to.equal(600);
      });

      it("vote: should revert because the proposal voting is already finished.", async () => {
        await expect(daoVoting.connect(user2).vote(1, true)).to.be.revertedWith(
          "ERROR: This proposal voting is already finished."
        );
      });

      it("finishProposal: should revert because this proposal voting is already finished.", async () => {
        await expect(
          daoVoting.connect(owner).finishProposal(1)
        ).to.be.revertedWith(
          "ERROR: This proposal voting is already finished."
        );
      });
    });

    describe("Special cases", () => {
      it("addProposal → vote → finishProposal: case where minimumQuorum isn't reached.", async () => {
        const jsonAbi = [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_value",
                type: "uint256",
              },
            ],
            name: "setMinimumQuorum",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        const iface = new ethers.utils.Interface(jsonAbi);
        const calldata = iface.encodeFunctionData("setMinimumQuorum", [1000]);
        description2 = "Change minimum quorum to 1000 votes.";

        await daoVoting
          .connect(owner)
          .addProposal(calldata, daoVoting.address, description2);
        await daoVoting.connect(user1).vote(2, false);
        await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

        expect(await daoVoting.finishProposal(2))
          .to.emit(daoVoting, "ProposalFinished")
          .withArgs(2, description2, false, 0, 500);
      });

      it("addProposal → vote → finishProposal: case where minimumQuorum is reached, but the decision is negative.", async () => {
        const jsonAbi = [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_value",
                type: "uint256",
              },
            ],
            name: "setMinimumQuorum",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        const iface = new ethers.utils.Interface(jsonAbi);
        const calldata = iface.encodeFunctionData("setMinimumQuorum", [1000]);
        description2 = "Change minimum quorum to 1000 votes.";

        await daoVoting
          .connect(owner)
          .addProposal(calldata, daoVoting.address, description2);
        await daoVoting.connect(user1).vote(3, true);
        await daoVoting.connect(user2).vote(3, false);
        await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

        expect(await daoVoting.finishProposal(3))
          .to.emit(daoVoting, "ProposalFinished")
          .withArgs(2, description2, false, 500, 1200);
      });

      it("addProposal → vote → finishProposal: case where the decision is positive, but the external function call fails.", async () => {
        const jsonAbi = [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_value",
                type: "uint256",
              },
            ],
            name: "setNonExistingThing",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];
        const iface = new ethers.utils.Interface(jsonAbi);
        const calldata = iface.encodeFunctionData("setNonExistingThing", [
          1000,
        ]);
        description2 = "Change minimum quorum to 1000 votes.";

        await daoVoting
          .connect(owner)
          .addProposal(calldata, daoVoting.address, description2);
        await daoVoting.connect(user1).vote(4, false);
        await daoVoting.connect(user2).vote(4, true);
        await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

        await expect(daoVoting.finishProposal(4)).to.be.revertedWith(
          "ERROR: External function call by signature failed."
        );
      });
    });
  });

  after(async () => {
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [xxxAdminAddress],
    });
  });
});
