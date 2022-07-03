import "@nomiclabs/hardhat-ethers";
import { deploy, readDeploymentData, writeDeploymentData } from './utils/deploy-utils';

let data = readDeploymentData();

deploy("ACDMToken").then((acdmToken) => {
  data["ACDMToken"].address = acdmToken.address;
  data["ACDMPlatform"].args[2] = acdmToken.address;
  deploy("XXXToken").then((xxxToken) => {
    data["XXXToken"].address = xxxToken.address;
    data["Staking"].args[2] = xxxToken.address;
    data["ACDMPlatform"].args[3] = xxxToken.address;
    deploy("Staking").then((staking) => {
      data["Staking"].address = staking.address;
      data["DAOVoting"].args[1] = staking.address;
      deploy("DAOVoting").then((daoVoting) => {
        data["DAOVoting"].address = daoVoting.address;
        data["ACDMPlatform"].args[4] = daoVoting.address;
        deploy("ACDMPlatform").then((acdmPlatform) => {
          data["ACDMPlatform"].address = acdmPlatform.address;
          writeDeploymentData(data);
        });
      });
    });
  });
});
