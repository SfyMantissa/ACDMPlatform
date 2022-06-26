import "@nomiclabs/hardhat-ethers";
import { deploy } from '../utils/deploy-utils';
import config from "../config";

deploy(
  "ACDMPlatform",
  config.ROUTER02_ADDRESS,
  config.WETH_ADDRESS,
  config.ACDMTOKEN_ADDRESS,
  config.XXXTOKEN_ADDRESS,
  config.DAOVOTING_ADDRESS
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
