import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { ethers } from "hardhat";
import { testDeploy } from "../utils/deploy-utils";

describe("XXXToken", () => {
  let xxxToken: Contract;
  let zeroAddress: string = "0x0000000000000000000000000000000000000000";
  let user: SignerWithAddress;

  before(async () => {
    [, user] = await ethers.getSigners();
    xxxToken = await testDeploy("XXXToken", user.address);
  });

  it("mint: should give account1 1000 tokens and increase totalSupply by 1000.", async () => {
    expect(await xxxToken.mint(user.address, 1000))
      .to.emit(xxxToken, "Transfer")
      .withArgs(zeroAddress, user.address, 1000);

    expect(await xxxToken.totalSupply()).to.equal(11000);
  });

  it("burn: should burn 50 tokens of account1 and decrease totalSupply by 50", async () => {
    expect(await xxxToken.burn(user.address, 50))
      .to.emit(xxxToken, "Transfer")
      .withArgs(user.address, zeroAddress, 50);

    expect(await xxxToken.totalSupply()).to.equal(10950);
  });
});
