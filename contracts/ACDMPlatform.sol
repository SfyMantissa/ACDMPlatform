// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./XXXToken.sol";
import "./ACDMToken.sol";
import "./DAO.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract ACDMPlatform is AccessControl, ReentrancyGuard {

  using Counters for Counters.Counter;
  Counters.Counter private orderCount;

  enum RoundType{ None, Sale, Trade }
  RoundType lastRound;

  bytes32 public constant REGISTERED = keccak256("REGISTERED");
  bytes32 public constant DAO = keccak256("DAO");
  uint256 public constant INITIAL_VOLUME = 100000 * 10**6;
  uint256 public constant INITIAL_PRICE = 10**7;

  uint256 public refererTradeCommission = 25;
  uint256 public refererOneCommission = 50;
  uint256 public refererTwoCommission = 30;

  uint256 public sellPrice;
  uint256 public tradeVolume;
  address public owner;
  address public weth;
  address public uniswapV2Router;
  address public acdmTokenAddress;
  address public xxxTokenAddress;

  uint256 public _totalCommissionEth;
  uint256 private _saleFinishTime;
  uint256 private _tradeFinishTime;
  uint256 public _sellAmount;
  ACDMToken private _token;
  XXXToken private _xxx;
  DAOVoting private _dao;

  mapping(address => address) private _refererOf;
  mapping(uint256 => Order) public orders;

  struct Order {
    address seller;
    uint256 price;
    uint256 availableAmount;
  }

  event UserRegistered(address userAddress, address refererAddress);
  
  event ACDMBought(address userAddress, uint256 amount);

  event RoundStarted(uint256 finishTime, RoundType round);
  event OrderAdded(
    uint256 indexed orderId,
    address indexed seller,
    uint256 indexed price,
    uint256 availableAmount
  );
  event OrderRemoved(uint256 indexed orderId, uint256 leftAmount);
  event OrderRedeemed(
    uint256 indexed orderId,
    address indexed buyer,
    uint256 deductedAmount
  );

  constructor(address _uniswapV2Router, address _weth, address token, address xxx, address dao) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(DAO, dao);

    lastRound = RoundType.None;
    _token = ACDMToken(token);
    acdmTokenAddress = token;
    xxxTokenAddress = xxx;
    _dao = DAOVoting(dao);
    _xxx = XXXToken(xxx);
    owner = msg.sender;
    weth = _weth;
    uniswapV2Router = _uniswapV2Router;
  }

  function register(address referer) external {
    require(!hasRole(REGISTERED, msg.sender), "ERROR: Caller already registered.");

    if (referer == address(0)) {
      _grantRole(REGISTERED, msg.sender);
    } else {
      require(hasRole(REGISTERED, referer), "ERROR: Referer is not registered.");
      _grantRole(REGISTERED, msg.sender);
      _refererOf[msg.sender] = referer;
    }

    emit UserRegistered(msg.sender, referer);
  }

  function startSaleRound() external {
    require(
      _saleFinishTime < block.timestamp && (lastRound == RoundType.None || lastRound == RoundType.Trade),
      "ERROR: Sale round has already started."
    );

    require(
      _tradeFinishTime < block.timestamp,
      "ERROR: Trade round still in progress."
    );

    _saleFinishTime = block.timestamp + 3 days;
    lastRound = RoundType.Sale;

    if (sellPrice > 0) {
      sellPrice = nextPrice(sellPrice);
    } else {
      sellPrice = INITIAL_PRICE;
    }

    if (tradeVolume > 0) {
      _sellAmount = tradeVolume / sellPrice;
    } else {
      _sellAmount = INITIAL_VOLUME;
    }

    _token.mint(address(this), _sellAmount);

    emit RoundStarted(_saleFinishTime, lastRound);
  }

  function buyACDM() external payable onlyRole(REGISTERED) {
    require(_saleFinishTime > block.timestamp, 
            "ERROR: Sale round is not in progress.");

    uint256 amount = msg.value / sellPrice;

    if (amount >= _sellAmount) {
      amount = _sellAmount;
      _saleFinishTime = block.timestamp;
    }

    _sellAmount -= amount;
    _token.transfer(msg.sender, amount);

    address refererOne = _refererOf[msg.sender];

    if (refererOne != address(0)) {
      payable(refererOne).transfer(
        (msg.value * refererOneCommission) / 1000
      );

      address refererTwo = _refererOf[refererOne];

      if (refererTwo != address(0)) {
        payable(refererTwo).transfer(
          (msg.value * refererTwoCommission) / 1000
        );
      }
    }

    uint256 change = msg.value - (amount * sellPrice);

    if (change > 0) {
      payable(msg.sender).transfer(change);
    }

    emit ACDMBought(msg.sender, amount);
  }

  function startTradeRound() external {

    require(
      _tradeFinishTime < block.timestamp && lastRound == RoundType.Sale,
      "ERROR: Trade round has already started."
    );

    require(
      _saleFinishTime < block.timestamp,
      "ERROR: Sale round still in progress."
    );

    if (_sellAmount > 0) {
      _token.burn(address(this), _sellAmount);
    }

    _tradeFinishTime = block.timestamp + 3 days;
    lastRound = RoundType.Trade;
    tradeVolume = 0;

    emit RoundStarted(_tradeFinishTime, lastRound);
  }

  function addOrder(uint256 price, uint256 amount)
    external
    onlyRole(REGISTERED)
  {
    require(_tradeFinishTime > block.timestamp,
            "ERROR: Trade round is not in progress.");

    _token.transferFrom(msg.sender, address(this), amount);
    Order storage order = orders[orderCount.current()];
    order.seller = msg.sender;
    order.price = price;
    order.availableAmount = amount;

    emit OrderAdded(orderCount.current(), msg.sender, price, amount);
    orderCount.increment();
  }

  function removeOrder(uint256 orderId)
    external
    onlyRole(REGISTERED)
  {
    Order storage order = orders[orderId];

    require(order.seller == msg.sender, "ERROR: The order does not belong to caller.");

    _token.transfer(order.seller, order.availableAmount);

    emit OrderRemoved(orderId, order.availableAmount);

    order.availableAmount = 0;
  }

  function redeemOrder(uint256 orderId, uint256 amount)
    external
    payable
    onlyRole(REGISTERED)
    nonReentrant
  {
    require(_tradeFinishTime > block.timestamp, "ERROR: Trade round is not in progress.");

    Order storage order = orders[orderId];
    require(order.availableAmount > 0, "ERROR: Order is already redeemed.");
    require(msg.value >= amount * order.price, "ERROR: Insufficient ETH sent.");

    if (amount > order.availableAmount) {
      amount = order.availableAmount;
    }

    uint256 amountEth = amount * order.price;
    uint256 commissionEth = (amountEth * refererTradeCommission) / 1000;

    tradeVolume += amountEth;
    order.availableAmount -= amount;

    _token.transfer(msg.sender, amount);
    payable(order.seller).transfer(amountEth - (commissionEth * 2));

    address refererOne = _refererOf[msg.sender];

    if (refererOne != address(0)) {
      payable(refererOne).transfer(commissionEth);

      address refererTwo = _refererOf[refererOne];

      if (refererTwo != address(0)) {
        payable(refererTwo).transfer(commissionEth);
      } else {
        _totalCommissionEth += commissionEth;
      }
    } else {
      _totalCommissionEth += commissionEth * 2;
    }

    uint256 change = msg.value - (amount * order.price);

    if (change > 0) {
      payable(msg.sender).transfer(change);
    }

    emit OrderRedeemed(orderId, msg.sender, amount);
  }

  function withdrawCommission()
    external
    onlyRole(DAO)
    nonReentrant
  {
    payable(owner).transfer(_totalCommissionEth);
    _totalCommissionEth = 0;
  }

  function burnTokens()
    external
    onlyRole(DAO)
  {
    uint256 balance = address(this).balance;
    address[] memory pair = new address[](2);
    pair[0] = weth;
    pair[1] = xxxTokenAddress;

    uint256[] memory minOutAmounts = IUniswapV2Router02(uniswapV2Router).getAmountsOut(balance, pair);

    IUniswapV2Router02(uniswapV2Router).swapExactETHForTokens{ value: balance }(
      minOutAmounts[1],
      pair,
      msg.sender,
      block.timestamp
    );

    _xxx.burn(address(this), minOutAmounts[1]);
  }

  function setRefererTradeCommission(uint256 _value)
    external
    onlyRole(DAO)
  {
    refererTradeCommission = _value;
  }

  function setRefererOneCommission(uint256 _value)
    external
    onlyRole(DAO)
  {
    refererOneCommission = _value;
  }

  function setRefererTwoCommission(uint256 _value)
    external
    onlyRole(DAO)
  {
    refererTwoCommission = _value;
  }

  function nextPrice(uint256 price) pure internal returns (uint256) {
    uint256 newPrice = ((price * 3) / 100) + 4000000;
    return newPrice;
  }

}
