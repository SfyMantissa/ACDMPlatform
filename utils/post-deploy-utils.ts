import { ethers } from "hardhat";
import config from "../config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const postDeploy = async () => {
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();

  const acdmToken = await ethers.getContractAt("ACDMToken", config.ACDMTOKEN_ADDRESS);
  const xxxToken = await ethers.getContractAt("XXXToken", config.XXXTOKEN_ADDRESS);
  const staking = await ethers.getContractAt("Staking", config.STAKING_ADDRESS);

  await acdmToken.connect(owner).grantRole(await acdmToken.MANIPULATOR_ROLE(), config.ACDMPLATFORM_ADDRESS);
  console.log("Allow ACDM platform to mint/burn ACDM tokens: CHECK.")

  await xxxToken.connect(owner).grantRole(await xxxToken.MANIPULATOR_ROLE(), config.STAKING_ADDRESS);
  console.log("Allow staking contract to mint/burn XXX tokens: CHECK.")

  await xxxToken.connect(owner).grantRole(await xxxToken.MANIPULATOR_ROLE(), config.ACDMPLATFORM_ADDRESS);
  console.log("Allow ACDM platform to mint/burn XXX tokens: CHECK.")

  await staking.connect(owner).grantRole(await staking.DAO(), config.DAOVOTING_ADDRESS);
  console.log("Allow DAO voting contract to call DAO-only functions in staking contract: CHECK.")
}

postDeploy()
