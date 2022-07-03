import * as fs from 'fs';
import hre from "hardhat";

const CONFIG = './deployments.json';

export const testDeploy = async (name: string, ...args: any[]) => {
  const Contract = await hre.ethers.getContractFactory(name);
  const contract = await Contract.deploy(...args);
  await contract.deployed();

  return contract;
};

export const deploy = async (name: string) => {
  const data = readDeploymentData();
  const args = data[name].args;
  const contract = await testDeploy(name, ...args ?? "");
  console.log(name + " deployed to:", contract.address);

  return contract;
};

export const verifyDeploy = async (name: string) => {
  const contract = await deploy(name);
  const data = readDeploymentData();
  _verifyDeployment(data[name]);

  return contract;
};

export const readDeploymentData = () => {
  const rawData: any = fs.readFileSync(CONFIG);
  return JSON.parse(rawData);
};

export const writeDeploymentData = (data: string) => {
  const rawData = JSON.stringify(data, null, 2);
  fs.writeFileSync(CONFIG, rawData);
};

const _verifyDeployment = async (config: any) => {
  await hre.run("verify:verify", {
    address: config.address,
    constructorArguments: config.constructor
  });
};
