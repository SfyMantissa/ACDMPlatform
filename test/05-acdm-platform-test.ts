import { expect } from "chai";
import { testDeploy } from "../utils/deploy-utils";
import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
import { ethers, waffle } from "hardhat";
import hre from "hardhat";
import { addLiquidity, buildTree, getProof, getRoot } from "../utils/staking-utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ACDMToken, XXXToken, Staking, DAOVoting, ACDMPlatform } from "../deployments.json";

describe("ACDMPlatform", () => {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let staking: Contract;
  let xxxToken: Contract;
  let adminAddress: string;
  let acdmToken: Contract;
  let daoVoting: Contract;
  let acdmPlatform: Contract;
  let merkleTree: MerkleTree;
  let zeroAddress: string = "0x0000000000000000000000000000000000000000";
  const provider = waffle.provider;

  before(async () => {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    adminAddress = "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF";

    xxxToken = await ethers.getContractAt("XXXToken", XXXToken.address);
    acdmToken = await ethers.getContractAt("ACDMToken", ACDMToken.address);

    let addresses = [
      owner.address,
      user1.address,
      user2.address,
      user3.address,
      user4.address
    ];

    merkleTree = buildTree(addresses);

    staking = await testDeploy(
      "Staking",
      getRoot(merkleTree),
      Staking.args[1],
      Staking.args[2],
      Staking.args[3],
      Staking.args[4],
      Staking.args[5]
    );

    daoVoting = await testDeploy(
      "DAOVoting",
      DAOVoting.args[0],
      staking.address,
      DAOVoting.args[2],
      DAOVoting.args[3]
    );

    acdmPlatform = await testDeploy(
      "ACDMPlatform",
      ACDMPlatform.args[0],
      ACDMPlatform.args[1],
      ACDMPlatform.args[2],
      ACDMPlatform.args[3],
      daoVoting.address
    );

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [adminAddress],
    });
    const admin = await ethers.getSigner(adminAddress);

    await xxxToken.connect(admin).grantRole(await xxxToken.MANIPULATOR_ROLE(), acdmPlatform.address);
    await acdmToken.connect(admin).grantRole(await acdmToken.MANIPULATOR_ROLE(), acdmPlatform.address);
    await xxxToken.connect(admin).mint(owner.address, 100000);
    await xxxToken.connect(admin).mint(user1.address, 100000);
  });

  describe("Registration", () => {
    it("register: should be able to register without referer", async () => {
      expect(await acdmPlatform.connect(user1).register(zeroAddress))
        .to.emit(acdmPlatform, "UserRegistered")
        .withArgs(user1.address, zeroAddress);
    });

    it("register: should NOT be able to register again as the same user without referer", async () => {
      await expect(acdmPlatform.connect(user1).register(zeroAddress)).to.be.revertedWith("ERROR: Caller already registered.");
    });

    it("register: should be able to register with referer", async () => {
      expect(await acdmPlatform.connect(user2).register(user1.address))
        .to.emit(acdmPlatform, "UserRegistered")
        .withArgs(user2.address, user1.address);
    });

    it("register: should NOT be able to register with an unregistered referer", async () => {
      await expect(acdmPlatform.connect(user3).register(user4.address)).to.be.revertedWith("ERROR: Referer is not registered.");
    });

    it("register: shound be able to register with a registered referer", async () => {
      expect(await acdmPlatform.connect(user3).register(user2.address))
        .to.emit(acdmPlatform, "UserRegistered")
        .withArgs(user3.address, user2.address);
    });
  });

  describe("First Sale Round", () => {
    it("startSaleRound: should be able to start the sale round", async () => {
      expect(await acdmPlatform.connect(owner).startSaleRound()).to.emit(acdmPlatform, "RoundStarted");
      expect(await acdmToken.balanceOf(acdmPlatform.address)).to.be.equal(
        100000 * 10 ** 6
      );
    });

    it("startSaleRound: should NOT be able to start another sale round while the current one is in progress", async () => {
      await expect(acdmPlatform.connect(user3).startSaleRound()).to.be.revertedWith("ERROR: Sale round has already started.");
    });

    it("buyACDM: should be able to buy 10 ACDM tokens (no referers)", async () => {
      const priceInWei = ethers.utils.parseEther("0.0001");
      expect(await acdmPlatform.connect(user1).buyACDM({ value: priceInWei })).to.emit(acdmPlatform, "ACDMBought").withArgs(user1.address, 10 * 10 ** 6);
    });

    it("buyACDM: should be able to buy 10 ACDM tokens (one referer)", async () => {
      const priceInWei = ethers.utils.parseEther("0.0001");
      const refererCommission = ethers.utils.parseEther("0.000005");
      const refererBalanceBefore = await provider.getBalance(user1.address);

      expect(await acdmPlatform.connect(user2).buyACDM({ value: priceInWei })).to.emit(acdmPlatform, "ACDMBought").withArgs(user2.address, 10 * 10 ** 6);

      const refererBalanceAfter = await provider.getBalance(user1.address);

      expect(refererBalanceAfter.sub(refererBalanceBefore)).to.be.equal(refererCommission);
    });

    it("buyACDM: should be able to buy 10 ACDM tokens (two referers)", async () => {
      const priceInWei = ethers.utils.parseEther("0.0001");
      const refererOneCommission = ethers.utils.parseEther("0.000005");
      const refererTwoCommission = ethers.utils.parseEther("0.000003");
      const refererOneBalanceBefore = await provider.getBalance(user2.address);
      const refererTwoBalanceBefore = await provider.getBalance(user1.address);

      expect(await acdmPlatform.connect(user3).buyACDM({ value: priceInWei })).to.emit(acdmPlatform, "ACDMBought").withArgs(user3.address, 10 * 10 ** 6);

      const refererOneBalanceAfter = await provider.getBalance(user2.address);
      const refererTwoBalanceAfter = await provider.getBalance(user1.address);

      expect(refererOneBalanceAfter.sub(refererOneBalanceBefore)).to.be.equal(refererOneCommission);
      expect(refererTwoBalanceAfter.sub(refererTwoBalanceBefore)).to.be.equal(refererTwoCommission);
    });

    it("startTradeRound: should NOT be able to start trade round while the sale round is in progress", async () => {
      await expect(acdmPlatform.connect(user3).startTradeRound()).to.be.revertedWith("ERROR: Sale round still in progress.");
    });

    it("addOrder: should NOT be able to add a new order during the sale round", async () => {
      await acdmToken.connect(user1).approve(acdmPlatform.address, 5 * 10 ** 6);
      const orderPrice = 10000000 * 1.5;
      await expect(acdmPlatform.connect(user1).addOrder(orderPrice, 5 * 10 ** 6)).to.be.revertedWith("ERROR: Trade round is not in progress.");
    });

    it("buyACDM: should be able to buy the rest of ACDM tokens", async () => {
      const priceInWei = ethers.utils.parseEther("1");
      const expectedPrice = ethers.utils.parseEther("0.9997");
      const balanceBefore = await provider.getBalance(user1.address);

      const rBuy = await (await acdmPlatform.connect(user1).buyACDM({ value: priceInWei })).wait();
      const gasUsed = rBuy.gasUsed;

      const balanceAfter = await provider.getBalance(user1.address);

      expect(balanceBefore.sub(balanceAfter)).to.be.equal(expectedPrice.add(gasUsed));
    });
  });

  describe("First Trade Round", () => {

    it("startTradeRound: should be able to start the trade round (nothing to burn)", async () => {
      expect(await acdmPlatform.connect(user1).startTradeRound()).to.emit(acdmPlatform, "RoundStarted");
    });

    it("startTradeRound: should NOT be able to start another trade round while the current one is in progress", async () => {
      await expect(acdmPlatform.connect(user1).startTradeRound()).to.be.revertedWith("ERROR: Trade round has already started.");
    });

    it("buyACDM: should NOT be able to buy 10 ACDM tokens", async () => {
      const priceInWei = ethers.utils.parseEther("0.0001");
      await expect(acdmPlatform.connect(user1).buyACDM({ value: priceInWei })).to.be.revertedWith("ERROR: Sale round is not in progress.");
    });

    it("startSaleRound: should NOT be able to start sale round while the trade round is in progress", async () => {
      await expect(acdmPlatform.connect(user1).startSaleRound()).to.be.revertedWith("ERROR: Trade round still in progress.");
    });

    it("addOrder: should be able to add new orders", async () => {
      const eth1 = 2 * 10 ** 7;
      const amount1 = 5 * 10 ** 6;
      await acdmToken.connect(user1).approve(acdmPlatform.address, amount1);
      expect(await acdmPlatform.connect(user1).addOrder(eth1, amount1)).to.emit(acdmPlatform, "OrderAdded").withArgs(0, user1.address, eth1, amount1);

      const eth2 = 2 * 10 ** 7;
      const amount2 = 2 * 10 ** 6;
      await acdmToken.connect(user2).approve(acdmPlatform.address, amount2);
      expect(await acdmPlatform.connect(user2).addOrder(eth2, amount2)).to.emit(acdmPlatform, "OrderAdded").withArgs(1, user2.address, eth2, amount2);

      await acdmToken.connect(user2).approve(acdmPlatform.address, amount2);
      expect(await acdmPlatform.connect(user2).addOrder(eth2, amount2)).to.emit(acdmPlatform, "OrderAdded").withArgs(2, user2.address, eth2, amount2);

      const eth3 = 3 * 10 ** 7;
      const amount3 = 6 * 10 ** 6;
      await acdmToken.connect(user2).approve(acdmPlatform.address, amount3);
      expect(await acdmPlatform.connect(user2).addOrder(eth3, amount3)).to.emit(acdmPlatform, "OrderAdded").withArgs(3, user2.address, eth3, amount3);
    });

    it("removeOrder: should be able to remove the order", async () => {
      expect(await acdmPlatform.connect(user2).removeOrder(2)).to.emit(acdmPlatform, "OrderRemoved").withArgs(2, 2 * 10 ** 6);
    });

    it("removeOrder: should NOT be able to remove the order belonging to a different user", async () => {
      await expect(acdmPlatform.connect(user2).removeOrder(0)).to.be.revertedWith("ERROR: The order does not belong to caller.");
    });

    it("redeemOrder: should NOT be able to redeem with insufficient ETH", async () => {
      const eth = ethers.utils.parseEther("0");
      await expect(acdmPlatform.connect(user3).redeemOrder(0, 4 * 10 ** 6, { value: eth })).to.be.revertedWith("ERROR: Insufficient ETH sent.");
    });

    it("redeemOrder: redeem order requesting more tokens than available with excessive ETH and two referers", async () => {
      const eth = ethers.utils.parseEther("0.0001");
      expect(await acdmPlatform.connect(user3).redeemOrder(1, 5 * 10 ** 6, { value: eth })).to.emit(acdmPlatform, "OrderRedeemed").withArgs(0, user3.address, 1 * 10 ** 6);
    });

    it("redeemOrder: should NOT be able to redeem an order which was redeemed previously", async () => {
      const eth = ethers.utils.parseEther("0.0001");
      await expect(acdmPlatform.connect(user3).redeemOrder(1, 5 * 10 ** 6, { value: eth })).to.be.revertedWith("ERROR: Order is already redeemed.");
    });

    it("redeemOrder: redeem order with a single referer", async () => {
      const eth = ethers.utils.parseEther("0.0002");
      expect(await acdmPlatform.connect(user2).redeemOrder(0, 5 * 10 ** 6, { value: eth })).to.emit(acdmPlatform, "OrderRedeemed").withArgs(0, user3.address, 1 * 10 ** 6);
    });

    it("redeemOrder: redeem order with no referers", async () => {
      const eth = ethers.utils.parseEther("0.0003");
      expect(await acdmPlatform.connect(user1).redeemOrder(3, 6 * 10 ** 6, { value: eth })).to.emit(acdmPlatform, "OrderRedeemed").withArgs(0, user3.address, 1 * 10 ** 6);
    });
  });

  describe("Second Sale Round", () => {
    it("startSaleRound: should be able to start the sale round", async () => {
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
      const tradeVolume = await acdmPlatform.tradeVolume();
      const price = await acdmPlatform.salePrice();
      const newPrice = price.mul(3).div(100).add(4000000);
      expect(await acdmPlatform.connect(owner).startSaleRound()).to.emit(acdmPlatform, "RoundStarted");
      expect(await acdmToken.balanceOf(acdmPlatform.address)).to.be.equal(
        tradeVolume.div(newPrice)
      );
    });

    it("redeemOrder: should NOT be able to redeem orders during sale rounds", async () => {
      const eth = ethers.utils.parseEther("0.0002");
      await expect(acdmPlatform.connect(user2).redeemOrder(4, 5 * 10 ** 6, { value: eth })).to.be.revertedWith("ERROR: Trade round is not in progress.");
    });
  });

  describe("Second Trade Round", () => {
    it("startTradeRound: should be able to start the trade round", async () => {
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
      expect(await acdmPlatform.connect(user1).startTradeRound()).to.emit(acdmPlatform, "RoundStarted");
    });
  });

  describe("DAO Votings", () => {
    it("setRefererTradeCommission: a vote to change refererTradeCommission 2.5% → 3.5%", async () => {
      const jsonAbi = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "setRefererTradeCommission",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      const iface = new ethers.utils.Interface(jsonAbi);
      const callData = iface.encodeFunctionData("setRefererTradeCommission", [35]);
      const description = "Change the referer trade commission: 2.5% → 3.5%.";

      await daoVoting.connect(owner).addProposal(callData, acdmPlatform.address, description);

      await addLiquidity(staking, owner, 5000, 1000);
      const proof1 = getProof(merkleTree, owner.address);
      await staking.connect(owner).stake(1000, proof1);
      await daoVoting.connect(owner).vote(1, true);

      await addLiquidity(staking, user1, 5000, 500);
      const proof2 = getProof(merkleTree, user1.address);
      await staking.connect(user1).stake(500, proof2);
      await daoVoting.connect(user1).vote(1, false);

      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

      await daoVoting.finishProposal(1);

      expect(await acdmPlatform.refererTradeCommission()).to.equal(35);
    });

    it("setRefererOneCommission: a vote to change refererOneCommission 5% → 7%", async () => {
      const jsonAbi = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "setRefererOneCommission",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      const iface = new ethers.utils.Interface(jsonAbi);
      const callData = iface.encodeFunctionData("setRefererOneCommission", [70]);
      const description = "Change the referer one commission: 5% → 7%.";

      await daoVoting.connect(owner).addProposal(callData, acdmPlatform.address, description);

      await addLiquidity(staking, owner, 5000, 1000);
      const proof1 = getProof(merkleTree, owner.address);
      await staking.connect(owner).stake(1000, proof1);
      await daoVoting.connect(owner).vote(2, true);

      await addLiquidity(staking, user1, 5000, 500);
      const proof2 = getProof(merkleTree, user1.address);
      await staking.connect(user1).stake(500, proof2);
      await daoVoting.connect(user1).vote(2, false);

      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

      await daoVoting.finishProposal(2);

      expect(await acdmPlatform.refererOneCommission()).to.equal(70);
    });

    it("setRefererTwoCommission: a vote to change refererTwoCommission 3% → 4%", async () => {
      const jsonAbi = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "setRefererTwoCommission",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      const iface = new ethers.utils.Interface(jsonAbi);
      const callData = iface.encodeFunctionData("setRefererTwoCommission", [40]);
      const description = "Change the referer two commission: 3% → 4%.";

      await daoVoting.connect(owner).addProposal(callData, acdmPlatform.address, description);

      await addLiquidity(staking, owner, 5000, 1000);
      const proof1 = getProof(merkleTree, owner.address);
      await staking.connect(owner).stake(1000, proof1);
      await daoVoting.connect(owner).vote(3, true);

      await addLiquidity(staking, user1, 5000, 500);
      const proof2 = getProof(merkleTree, user1.address);
      await staking.connect(user1).stake(500, proof2);
      await daoVoting.connect(user1).vote(3, false);

      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

      await daoVoting.finishProposal(3);

      expect(await acdmPlatform.refererTwoCommission()).to.equal(40);
    });

    it("withdrawCommission: a vote to withdraw the accumulated commison to the owner's wallet", async () => {
      const jsonAbi = [
        {
          "inputs": [],
          "name": "withdrawCommission",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ];
      const iface = new ethers.utils.Interface(jsonAbi);
      const callData = iface.encodeFunctionData("withdrawCommission", []);
      const description = "Withdraw the accumulated commission to owner's wallet.";

      await daoVoting.connect(owner).addProposal(callData, acdmPlatform.address, description);

      await addLiquidity(staking, owner, 5000, 1000);
      const proof1 = getProof(merkleTree, owner.address);
      await staking.connect(owner).stake(1000, proof1);
      await daoVoting.connect(owner).vote(4, true);

      await addLiquidity(staking, user1, 5000, 500);
      const proof2 = getProof(merkleTree, user1.address);
      await staking.connect(user1).stake(500, proof2);
      await daoVoting.connect(user1).vote(4, false);

      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

      await daoVoting.finishProposal(4);
    });

    it("burnTokens: a vote to use the accumulated commison to buy XXXTokens on Uniswap and burn them", async () => {
      const jsonAbi = [
        {
          "inputs": [],
          "name": "burnTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      const iface = new ethers.utils.Interface(jsonAbi);
      const callData = iface.encodeFunctionData("burnTokens", []);
      const description = "Buy XXXTokens for accumulated commission and burn them.";

      await daoVoting.connect(owner).addProposal(callData, acdmPlatform.address, description);

      await addLiquidity(staking, owner, 5000, 1000);
      const proof1 = getProof(merkleTree, owner.address);
      await staking.connect(owner).stake(1000, proof1);
      await daoVoting.connect(owner).vote(5, true);

      await addLiquidity(staking, user1, 5000, 500);
      const proof2 = getProof(merkleTree, user1.address);
      await staking.connect(user1).stake(500, proof2);
      await daoVoting.connect(user1).vote(5, false);

      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);

      await daoVoting.finishProposal(5);
    });
  });

  after(async () => {
    const admin = await ethers.getSigner(adminAddress);
    await xxxToken.connect(admin).revokeRole(await xxxToken.MANIPULATOR_ROLE(), acdmPlatform.address);
    await acdmToken.connect(admin).revokeRole(await acdmToken.MANIPULATOR_ROLE(), acdmPlatform.address);

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [adminAddress],
    });
  });
});
