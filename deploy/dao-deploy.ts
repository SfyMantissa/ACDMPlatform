import "@nomiclabs/hardhat-ethers";
import { deploy } from '../utils/deploy-utils';
import config from "../config";

deploy(
  "DAOVoting",
  config.LIQUIDITY_TOKEN_ADDRESS,
  config.STAKING_ADDRESS,
  config.MINIMUM_QUORUM,
  config.DEBATING_PERIOD
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
