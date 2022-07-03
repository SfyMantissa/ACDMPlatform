import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ACDMToken, XXXToken, Staking, DAOVoting, ACDMPlatform } from "../deployments.json";

const postDeploy = async () => {
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();

  const acdmToken = await ethers.getContractAt("ACDMToken", ACDMToken.address);
  const xxxToken = await ethers.getContractAt("XXXToken", XXXToken.address);
  const staking = await ethers.getContractAt("Staking", Staking.address);

  await acdmToken.connect(owner).grantRole(await acdmToken.MANIPULATOR_ROLE(), ACDMPlatform.address);
  console.log("Allow ACDM platform to mint/burn ACDM tokens: CHECK.")

  await xxxToken.connect(owner).grantRole(await xxxToken.MANIPULATOR_ROLE(), Staking.address);
  console.log("Allow staking contract to mint/burn XXX tokens: CHECK.")

  await xxxToken.connect(owner).grantRole(await xxxToken.MANIPULATOR_ROLE(), ACDMPlatform.address);
  console.log("Allow ACDM platform to mint/burn XXX tokens: CHECK.")

  await staking.connect(owner).grantRole(await staking.DAO(), DAOVoting.address);
  console.log("Allow DAO voting contract to call DAO-only functions in staking contract: CHECK.")
}

postDeploy()
