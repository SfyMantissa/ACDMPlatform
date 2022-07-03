import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ACDMPlatform } from "../../deployments.json";

task("removeOrder", "Allow the caller to remove an order with ACDM tokens.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("orderId", "Order ID.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmPlatform = await ethers.getContractAt(
      "ACDMPlatform",
      ACDMPlatform.address
    );

    const txRemoveOrder = acdmPlatform
      .connect(signerArray[args.signer])
      .removeOrder(args.orderId);
    const rRemoveOrder = await (await txRemoveOrder).wait();

    const user = signerArray[args.signer].address;
    const amount = rRemoveOrder.events[1].args[1];

    console.log(
      "User " +
      user +
      " removed an order with ID " +
      args.orderId +
      " and amount " +
      amount +
      "."
    );
  });
