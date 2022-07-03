import "@nomiclabs/hardhat-ethers";
import { deploy, _readDeploymentData, _writeDeploymentData } from './utils/deploy-utils';

let acdmToken, xxxToken, staking, dao;
let data = _readDeploymentData();

const deployChain = async () => {
  acdmToken = await deploy("ACDMToken");
  xxxToken = await deploy("XXXToken");

  data["Staking"].constructor[2] = xxxToken.address;
  staking = await deploy("Staking");

  data["DAOVoting"].constructor[1] = staking.address;
  dao = await deploy("DAOVoting");

  data["ACDMPlatform"].constructor[2] = acdmToken.address;
  data["ACDMPlatform"].constructor[3] = xxxToken.address;
  data["ACDMPlatform"].constructor[4] = dao.address;
  await deploy("ACDMPlatform");
}

_writeDeploymentData(data);
deployChain();

