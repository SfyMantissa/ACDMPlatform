import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { ethers } from "hardhat";
import { testDeploy } from "../utils/deploy-utils";

describe("ACDMToken", () => {
  let acdmToken: Contract;
  let zeroAddress: string = "0x0000000000000000000000000000000000000000";
  let user: SignerWithAddress;

  before(async () => {
    [, user] = await ethers.getSigners();
    acdmToken = await testDeploy("ACDMToken", user.address);
  });

  it("mint: should give account1 1000 tokens and increase totalSupply by 1000.", async () => {
    expect(await acdmToken.mint(user.address, 1000))
      .to.emit(acdmToken, "Transfer")
      .withArgs(zeroAddress, user.address, 1000);

    expect(await acdmToken.totalSupply()).to.equal(11000);
  });

  it("burn: should burn 50 tokens of account1 and decrease totalSupply by 50", async () => {
    expect(await acdmToken.burn(user.address, 50))
      .to.emit(acdmToken, "Transfer")
      .withArgs(user.address, zeroAddress, 50);

    expect(await acdmToken.totalSupply()).to.equal(10950);
  });

  it("decimals: should return the number of decimals the token uses", async () => {
    expect(await acdmToken.decimals()).to.equal(6);
  });
});
