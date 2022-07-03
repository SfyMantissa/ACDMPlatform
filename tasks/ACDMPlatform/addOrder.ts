import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ACDMToken, ACDMPlatform } from "../../deployments.json";

task("addOrder", "Allow the caller to add an order with ACDM tokens.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("price", "Price of assets in ETH.")
  .addParam("amount", "Amount of tokens to place as order.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmToken = await ethers.getContractAt(
      "ACDMToken",
      ACDMToken.address
    );
    const acdmPlatform = await ethers.getContractAt(
      "ACDMPlatform",
      ACDMPlatform.address
    );

    await acdmToken
      .connect(signerArray[args.signer])
      .approve(acdmPlatform.address, args.amount);
    const etherToWei = ethers.utils.parseEther(args.price);
    const txAddOrder = acdmPlatform
      .connect(signerArray[args.signer])
      .addOrder(etherToWei, args.amount);
    const rAddOrder = await (await txAddOrder).wait();

    const orderId = rAddOrder.events[1].args[0];
    const caller = rAddOrder.events[1].args[1];

    console.log(
      "User " +
      caller +
      " placed an order of " +
      args.amount +
      " of ACDM tokens for " +
      args.price +
      " ETH." +
      "\nOrder ID is: " +
      orderId +
      "."
    );
  });
