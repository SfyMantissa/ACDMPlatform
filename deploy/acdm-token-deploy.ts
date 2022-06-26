import "@nomiclabs/hardhat-ethers";
import { deploy } from '../utils/deploy-utils';

deploy("ACDMToken").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
