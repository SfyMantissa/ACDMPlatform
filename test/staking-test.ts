import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { ethers } from "hardhat";
import { testDeploy } from "../utils/deploy-utils";
import { addLiquidity } from "../utils/staking-utils";

import config from "../config";
import hre from "hardhat";

describe("Staking", () => {
  let staking: Contract;
  let owner: SignerWithAddress;
  let stakeAmount: number;

  before(async () => {
    [owner] = await ethers.getSigners();
    staking = await testDeploy(
      "Staking",
      config.LIQUIDITY_TOKEN_ADDRESS,
      config.XXXTOKEN_ADDRESS,
      config.REWARD_PERCENTAGE,
      config.REWARD_INTERVAL
    );
  });

  it("changeRewardPercentage: should be able to change the reward percentage.", async () => {
    let newRewardPercentage = 11;
    await staking.connect(owner).changeRewardPercentage(newRewardPercentage);
    expect(await staking.rewardPercentage()).to.equal(newRewardPercentage);
    await staking
      .connect(owner)
      .changeRewardPercentage(config.REWARD_PERCENTAGE);
  });

  it("changeRewardInterval: should be able to change the reward interval.", async () => {
    let newRewardInterval = 12;
    await staking.connect(owner).changeRewardInterval(newRewardInterval);
    expect(await staking.rewardInterval()).to.equal(newRewardInterval);
    await staking.connect(owner).changeRewardInterval(config.REWARD_INTERVAL);
  });

  it("changeLockInterval: should be able to change the lock interval.", async () => {
    let newLockInterval = 13;
    await staking.connect(owner).changeLockInterval(newLockInterval);
    expect(await staking.lockInterval()).to.equal(newLockInterval);
    await staking.connect(owner).changeLockInterval(120);
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

  it("stake: should successfully stake liquidity tokens.", async () => {
    await addLiquidity(staking, owner, 5000, 5000);

    expect(await staking.connect(owner).stake(5000))
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
      (balance * config.REWARD_PERCENTAGE) / 100
    );
    const numOfIntervals = Math.round(
      (lastClaimTimestamp - stakeStartTimestamp) / config.REWARD_INTERVAL
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
      (balance * config.REWARD_PERCENTAGE) / 100
    );
    const numOfIntervals = Math.round(
      (lastTimestamp - lastClaimTimestamp) / config.REWARD_INTERVAL
    );
    const reward = rewardPerInterval * numOfIntervals;

    // Call the function.
    expect(await staking.connect(owner).claim())
      .to.emit(staking, "Claimed")
      .withArgs(owner.address, reward);
  });

  it("unstake: should be able to unstake the staked tokens.", async () => {
    expect(await staking.connect(owner).unstake())
      .to.emit(staking, "Unstaked")
      .withArgs(owner.address, stakeAmount);
  });
});
