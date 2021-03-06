import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { XXXToken, Staking, DAOVoting } from "../deployments.json";

import { expect } from "chai";
import { ethers } from "hardhat";
import { testDeploy } from "../utils/deploy-utils";
import { addLiquidity, buildTree, getProof, getRoot } from "../utils/staking-utils";

import hre from "hardhat";

describe("Staking", () => {
  let staking: Contract;
  let daoVoting: Contract;
  let xxxToken: Contract;
  let xxxAdminAddress: string;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let user3: SignerWithAddress;
  let stakeAmount: number;
  let merkleTree: MerkleTree;

  before(async () => {
    [owner, user, , user3] = await ethers.getSigners();
    xxxAdminAddress = "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF";

    let addresses = [
      owner.address,
      user.address
    ];

    merkleTree = buildTree(addresses);

    staking = await testDeploy(
      "Staking",
      getRoot(merkleTree),
      Staking.args[1],
      Staking.args[2],
      Staking.args[3],
      Staking.args[4],
      Staking.args[5]
    );

    daoVoting = await testDeploy(
      "DAOVoting",
      DAOVoting.args[0],
      staking.address,
      DAOVoting.args[2],
      DAOVoting.args[3]
    );

    xxxToken = await ethers.getContractAt("XXXToken", XXXToken.address);

    await staking.grantRole(await staking.DAO(), daoVoting.address);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [xxxAdminAddress],
    });

    const xxxAdmin = await ethers.getSigner(xxxAdminAddress);

    await xxxToken.connect(xxxAdmin).grantRole(await xxxToken.MANIPULATOR_ROLE(), staking.address);
    await xxxToken.connect(xxxAdmin).mint(owner.address, 100000);
    await xxxToken.connect(xxxAdmin).mint(user.address, 100000);
    await xxxToken.connect(xxxAdmin).mint(user3.address, 100000);
  });

  it("stakeOf: should be able to get correct information about the user's stake.", async () => {
    const stakeOf = await staking.stakeOf(owner.address);
    expect(stakeOf[0]).to.equal(0);
    expect(stakeOf[1]).to.equal(0);
    expect(stakeOf[2]).to.equal(0);
    expect(stakeOf[3]).to.equal(0);
  });

  it("unstake: should revert because user didn't stake anything yet.", async () => {
    await expect(staking.connect(owner).unstake()).to.be.revertedWith(
      "ERROR: nothing is staked."
    );
  });

  it("stake: should revert because user is not in the whitelist.", async () => {
    await addLiquidity(staking, user3, 5000, 5000);

    const proof = getProof(merkleTree, user3.address);

    await expect(staking.connect(user3).stake(5000, proof))
      .to.be.revertedWith("ERROR: caller is not in the whitelist.");
  });

  it("stake: should successfully stake liquidity tokens.", async () => {
    await addLiquidity(staking, owner, 5000, 5000);

    const proof = getProof(merkleTree, owner.address);

    expect(await staking.connect(owner).stake(5000, proof))
      .to.emit(staking, "Staked")
      .withArgs(owner.address, 5000);
  });

  it("unstake: should revert given lockInterval didn't pass.", async () => {
    await expect(staking.connect(owner).unstake()).to.be.revertedWith(
      "ERROR: must wait for lock interval to pass."
    );
  });

  it("claim: should be able to claim the reward.", async () => {
    // Move lockInterval seconds to the future (to make sure that lockInterval passed).
    await hre.ethers.provider.send("evm_increaseTime", [120]);

    // Manually calculate the expected reward.
    const balance = (await staking.stakeOf(owner.address))[0];
    const stakeStartTimestamp = (await staking.stakeOf(owner.address))[1];
    const latestBlock = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );
    const lastClaimTimestamp = latestBlock.timestamp;

    const rewardPerInterval = Math.round(
      (balance * Number(Staking.args[3])) / 100
    );
    const numOfIntervals = Math.round(
      (lastClaimTimestamp - stakeStartTimestamp) / Number(Staking.args[4])
    );
    const reward = rewardPerInterval * numOfIntervals;

    // Call the function.
    expect(await staking.connect(owner).claim())
      .to.emit(staking, "Claimed")
      .withArgs(owner.address, reward);
  });

  it("claim: should be able to claim the reward yet again.", async () => {
    // Move the time forward some more.
    await hre.ethers.provider.send("evm_increaseTime", [120]);

    // Manually calculate the expected reward.
    const balance = (await staking.stakeOf(owner.address))[0];
    const lastClaimTimestamp = (await staking.stakeOf(owner.address))[3];
    const latestBlock = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );
    const lastTimestamp = latestBlock.timestamp;

    const rewardPerInterval = Math.round(
      (balance * Number(Staking.args[3])) / 100
    );
    const numOfIntervals = Math.round(
      (lastTimestamp - lastClaimTimestamp) / Number(Staking.args[4])
    );
    const reward = rewardPerInterval * numOfIntervals;

    // Call the function.
    expect(await staking.connect(owner).claim())
      .to.emit(staking, "Claimed")
      .withArgs(owner.address, reward);
  });

  it("changeLockInterval: should be able to change the lock interval via DAO voting", async () => {
    const jsonAbi = [{
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "changeLockInterval",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }];
    const iface = new ethers.utils.Interface(jsonAbi);
    const callData = iface.encodeFunctionData("changeLockInterval", [60 * 60 * 24]);
    const description = "Change the lock interval.";
    const proof = getProof(merkleTree, user.address);

    await daoVoting.connect(owner).addProposal(callData, staking.address, description);

    await addLiquidity(staking, user, 2000, 2000);
    await staking.connect(user).stake(2000, proof);

    await daoVoting.connect(owner).vote(1, true);
    await daoVoting.connect(user).vote(1, false);

    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

    await daoVoting.finishProposal(1);
    expect(await staking.lockInterval()).to.equal(60 * 60 * 24);
  });

  it("changeMerkleRoot: should be able to change the merkle root via DAO voting", async () => {
    const newRoot = "0x55e8063f883b9381398d8fef6fbae371817e8e4808a33a4145b8e3cdd65e3926";
    const jsonAbi = [{
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_merkleRoot",
          "type": "bytes32"
        }
      ],
      "name": "changeMerkleRoot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }];
    const iface = new ethers.utils.Interface(jsonAbi);
    const callData = iface.encodeFunctionData("changeMerkleRoot", [newRoot]);
    const description = "Change the merkle root to include new address.";
    const proof = getProof(merkleTree, user.address);

    await daoVoting.connect(owner).addProposal(callData, staking.address, description);

    await daoVoting.connect(owner).vote(2, true);
    await daoVoting.connect(user).vote(2, false);

    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

    await daoVoting.finishProposal(2);
    expect(await staking.merkleRoot()).to.equal(newRoot);
  });

  it("unstake: should be able to unstake the staked tokens.", async () => {
    expect(await staking.connect(owner).unstake())
      .to.emit(staking, "Unstaked")
      .withArgs(owner.address, stakeAmount);
  });

  after(async () => {
    const xxxAdmin = await ethers.getSigner(xxxAdminAddress);
    await xxxToken.connect(xxxAdmin).revokeRole(await xxxToken.MANIPULATOR_ROLE(), staking.address);

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [xxxAdminAddress],
    });
  });
});
