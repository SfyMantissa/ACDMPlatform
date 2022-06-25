import * as fs from 'fs';
import { ethers } from "hardhat";

export const deploy = async (name: string, ...args: any[]) => {
  const Contract = await ethers.getContractFactory(name);
  const contract = await Contract.deploy(...args);
  await contract.deployed();
  console.log(name + " deployed to:", contract.address);
  _updateDeploymentAddress(contract.address, name.toUpperCase());
};

export const testDeploy = async (name: string, ...args: any[]) => {
  const Contract = await ethers.getContractFactory(name);
  const contract = await Contract.deploy(...args);
  await contract.deployed();

  return contract;
};

const _updateDeploymentAddress = async (address: string, name: string) => {
  let config: string = './config.ts';
  fs.readFile(config, 'utf-8', (err: unknown, data: string) => {
    if (err) throw err;
    let regexString = name + '_ADDRESS: ".*",';
    let regex = new RegExp(regexString, "g");
    let update = data.replace(
      regex,
      name + '_ADDRESS: "' + address + '",'
    );

    fs.writeFile(config, update, 'utf-8', (err: unknown) => {
      if (err) throw err;
      console.log('Updated ' + name + '_ADDRESS in config.ts.');
    });
  });
};
