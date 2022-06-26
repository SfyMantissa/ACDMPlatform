import "@nomiclabs/hardhat-ethers";
import { deploy } from '../utils/deploy-utils';
import config from "../config";

deploy(
  "Staking",
  config.LIQUIDITY_TOKEN_ADDRESS,
  config.XXXTOKEN_ADDRESS,
  config.REWARD_PERCENTAGE,
  config.REWARD_INTERVAL,
  config.LOCK_INTERVAL
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
