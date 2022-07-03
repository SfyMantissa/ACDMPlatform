import "@nomiclabs/hardhat-ethers";
import { deploy, _readDeploymentData, _writeDeploymentData } from './utils/deploy-utils';

let acdmToken, xxxToken, staking, dao;
let data = _readDeploymentData();

const deployChain = async (data: any[]) => {
  acdmToken = await deploy("ACDMToken");
  xxxToken = await deploy("XXXToken");

  data["Staking"].args[2] = xxxToken.address;
  staking = await deploy("Staking");

  data["DAOVoting"].args[1] = staking.address;
  dao = await deploy("DAOVoting");

  data["ACDMPlatform"].args[2] = acdmToken.address;
  data["ACDMPlatform"].args[3] = xxxToken.address;
  data["ACDMPlatform"].args[4] = dao.address;
  await deploy("ACDMPlatform");
}

deployChain(data).then(() => _writeDeploymentData(data));
