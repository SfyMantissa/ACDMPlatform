import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ACDMPlatform } from "../../deployments.json";

task("redeemOrder", "Allow the caller to remove an order with ACDM tokens.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("orderId", "Order ID.")
  .addParam("amount", "Amount of tokens to redeem.")
  .addParam("ether", "Ether to send.")
  .setAction(async (args, { ethers }) => {
    const signerArray = await ethers.getSigners();
    const acdmPlatform = await ethers.getContractAt(
      "ACDMPlatform",
      ACDMPlatform.address
    );

    const user = signerArray[args.signer].address;
    const etherToWei = ethers.utils.parseEther(args.ether);
    const txRedeemOrder = acdmPlatform
      .connect(signerArray[args.signer])
      .redeemOrder(args.orderId, args.amount, { value: etherToWei });
    const rRedeemOrder = await (await txRedeemOrder).wait();

    const amount = rRedeemOrder.events[1].args[2];

    console.log(
      "User " +
      user +
      " redeemed " +
      amount +
      " of ACDM tokens for " +
      args.ether +
      " of ETH." +
      "\nOrder ID: " +
      args.orderId +
      "."
    );
  });
