import "@nomiclabs/hardhat-ethers";
import { deploy } from '../utils/deploy-utils';

deploy("ACDMToken", "0x83695063361619BF2765D885C51Cc6B72D650515").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
