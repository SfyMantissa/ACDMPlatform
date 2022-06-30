// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./XXXToken.sol";
import "./ACDMToken.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title A DAO proposal voting implementation with ERC-20 tokens.
/// @author Sfy Mantissa
contract ACDMPlatform is AccessControl, ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private orderCount;

  /// @dev Used to identify registered users.
  bytes32 public constant REGISTERED = keccak256("REGISTERED");

  /// @dev Used to identify DAO contract.
  bytes32 public constant DAO = keccak256("DAO");

  /// @dev Used to set the initial sale volume.
  uint256 public constant INITIAL_VOLUME = 100000 * 10**6;

  /// @dev Used to set the initial sale price.
  uint256 public constant INITIAL_PRICE = 10**7;

  /// @dev Commission for each referer per trade.
  uint256 public refererTradeCommission;

  /// @dev Commission for the first referer in the sale round.
  uint256 public refererOneCommission;

  /// @dev Commission for the second referer in the sale round.
  uint256 public refererTwoCommission;

  /// @dev Sale price.
  uint256 public salePrice;

  /// @dev Trade volume.
  uint256 public tradeVolume;

  /// @dev Address of the contract's deployer.
  address public owner;

  /// @dev Address of WETH token on the network.
  address public wethAddress;

  /// @dev Address of the XXX Coin on the network.
  address public xxxTokenAddress;

  uint256 private _totalCommission;
  uint256 private _saleFinishTime;
  uint256 private _tradeFinishTime;
  uint256 private _adjustedTradeVolume;

  /// @dev Uniswap V2 Router instance.
  IUniswapV2Router02 public uniV2Router;

  /// @dev ACDM Token instance.
  ACDMToken public acdmToken;

  /// @dev XXX Coin instance.
  XXXToken public xxxToken;

  mapping(address => address) private _refererOf;

  /// @dev List of all placed orders.
  mapping(uint256 => Order) public orders;

  struct Order {
    address seller;
    uint256 price;
    uint256 availableAmount;
  }

  enum RoundType {
    None,
    Sale,
    Trade
  }
  RoundType lastRound;

  /// @dev Emits when a user registers.
  ///      In case there's no referer, `refererAddress` should be set 
  ///      to address(0).
  event UserRegistered(
    address userAddress,
    address refererAddress
  );

  /// @dev Emits when a user buys ACDM tokens.
  event ACDMBought(
    address userAddress,
    uint256 amount
  );
  
  /// @dev Emits when a sale or trade round starts.
  event RoundStarted(
    uint256 finishTime,
    RoundType round
  );

  /// @dev Emits when a user adds an order.
  event OrderAdded(
    uint256 orderId,
    address seller,
    uint256 price,
    uint256 availableAmount
  );

  /// @dev Emits when a user removes an order.
  event OrderRemoved(
    uint256 orderId,
    uint256 leftAmount
  );

  /// @dev Emits when a user buys an order (partially or not).
  event OrderRedeemed(
    uint256 orderId,
    address buyer,
    uint256 deductedAmount
  );

  /// @param _uniV2RouterAddress Address for Uniswap Router V2 instance.
  /// @param _wethAddress Address of the WETH token.
  /// @param _acdmTokenAddress Address of the ACDM token.
  /// @param _xxxTokenAddress Address of the XXX Coin.
  /// @param _daoAddress Address of the DAO voting.
  constructor(
    address _uniV2RouterAddress,
    address _wethAddress,
    address _acdmTokenAddress,
    address _xxxTokenAddress,
    address _daoAddress
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(DAO, _daoAddress);

    refererTradeCommission = 25;
    refererOneCommission = 50;
    refererTwoCommission = 30;
    lastRound = RoundType.None;
    owner = msg.sender;

    acdmToken = ACDMToken(_acdmTokenAddress);
    uniV2Router = IUniswapV2Router02(_uniV2RouterAddress);
    xxxToken = XXXToken(_xxxTokenAddress);
    xxxTokenAddress = _xxxTokenAddress;
    wethAddress = _wethAddress;
  }

  /// @dev Allows the user to register.
  /// @param referer User's referer.
  ///        Set to address(0) if there's no referer.
  function register(address referer) external {
    require(
      !hasRole(REGISTERED, msg.sender),
      "ERROR: Caller already registered."
    );

    if (referer == address(0)) {
      _grantRole(REGISTERED, msg.sender);
    } else {
      require(
        hasRole(REGISTERED, referer),
        "ERROR: Referer is not registered."
      );
      _grantRole(REGISTERED, msg.sender);
      _refererOf[msg.sender] = referer;
    }

    emit UserRegistered(msg.sender, referer);
  }

  /// @dev Start the sale round.
  function startSaleRound() external {
    require(
      _saleFinishTime < block.timestamp &&
        (lastRound == RoundType.None || lastRound == RoundType.Trade),
      "ERROR: Sale round has already started."
    );

    require(
      _tradeFinishTime < block.timestamp,
      "ERROR: Trade round still in progress."
    );

    _saleFinishTime = block.timestamp + 3 days;
    lastRound = RoundType.Sale;

    if (salePrice > 0) {
      salePrice = nextPrice(salePrice);
    } else {
      salePrice = INITIAL_PRICE;
    }

    if (tradeVolume > 0) {
      _adjustedTradeVolume = tradeVolume / salePrice;
    } else {
      _adjustedTradeVolume = INITIAL_VOLUME;
    }

    acdmToken.mint(address(this), _adjustedTradeVolume);

    emit RoundStarted(_saleFinishTime, lastRound);
  }

  /// @dev Buy ACDM tokens.
  function buyACDM() external payable onlyRole(REGISTERED) {
    require(
      _saleFinishTime > block.timestamp,
      "ERROR: Sale round is not in progress."
    );

    uint256 amount = msg.value / salePrice;

    if (amount >= _adjustedTradeVolume) {
      amount = _adjustedTradeVolume;
      _saleFinishTime = block.timestamp;
    }

    _adjustedTradeVolume -= amount;
    acdmToken.transfer(msg.sender, amount);

    address refererOne = _refererOf[msg.sender];

    if (refererOne != address(0)) {
      payable(refererOne).transfer((msg.value * refererOneCommission) / 1000);

      address refererTwo = _refererOf[refererOne];

      if (refererTwo != address(0)) {
        payable(refererTwo).transfer((msg.value * refererTwoCommission) / 1000);
      }
    }

    uint256 change = msg.value - (amount * salePrice);
    payable(msg.sender).transfer(change);

    emit ACDMBought(msg.sender, amount);
  }

  /// @dev Start the trade round.
  function startTradeRound() external {
    require(
      _tradeFinishTime < block.timestamp && lastRound == RoundType.Sale,
      "ERROR: Trade round has already started."
    );

    require(
      _saleFinishTime < block.timestamp,
      "ERROR: Sale round still in progress."
    );

    if (_adjustedTradeVolume > 0) {
      acdmToken.burn(address(this), _adjustedTradeVolume);
    }

    _tradeFinishTime = block.timestamp + 3 days;
    lastRound = RoundType.Trade;
    tradeVolume = 0;

    emit RoundStarted(_tradeFinishTime, lastRound);
  }

  /// @dev Place an order to trade.
  /// @param price Price of the provided assets.
  /// @param amount Quantity of the provided assets.
  function addOrder(uint256 price, uint256 amount)
    external
    onlyRole(REGISTERED)
  {
    require(
      _tradeFinishTime > block.timestamp,
      "ERROR: Trade round is not in progress."
    );

    acdmToken.transferFrom(msg.sender, address(this), amount);
    Order storage order = orders[orderCount.current()];
    order.seller = msg.sender;
    order.price = price;
    order.availableAmount = amount;

    emit OrderAdded(orderCount.current(), msg.sender, price, amount);
    orderCount.increment();
  }

  /// @dev Remove an order from trade.
  /// @param orderId ID of the order to remove.
  function removeOrder(uint256 orderId) external onlyRole(REGISTERED) {
    Order storage order = orders[orderId];

    require(
      order.seller == msg.sender,
      "ERROR: The order does not belong to caller."
    );

    acdmToken.transfer(order.seller, order.availableAmount);

    emit OrderRemoved(orderId, order.availableAmount);

    order.availableAmount = 0;
  }

  /// @dev Redeem an order fully or partially.
  /// @param orderId ID of the order to redeem.
  /// @param amount Quantity of assets to redeem.
  function redeemOrder(uint256 orderId, uint256 amount)
    external
    payable
    onlyRole(REGISTERED)
    nonReentrant
  {
    require(
      _tradeFinishTime > block.timestamp,
      "ERROR: Trade round is not in progress."
    );

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

    acdmToken.transfer(msg.sender, amount);
    payable(order.seller).transfer(amountEth - (commissionEth * 2));

    address refererOne = _refererOf[msg.sender];

    if (refererOne != address(0)) {
      payable(refererOne).transfer(commissionEth);

      address refererTwo = _refererOf[refererOne];

      if (refererTwo != address(0)) {
        payable(refererTwo).transfer(commissionEth);
      } else {
        _totalCommission += commissionEth;
      }
    } else {
      _totalCommission += commissionEth * 2;
    }

    uint256 change = msg.value - (amount * order.price);
    payable(msg.sender).transfer(change);

    emit OrderRedeemed(orderId, msg.sender, amount);
  }

  /// @dev Withdraw the commission to owner (can ONLY be decided by a vote).
  function withdrawCommission() external onlyRole(DAO) nonReentrant {
    payable(owner).transfer(_totalCommission);
    _totalCommission = 0;
  }

  /// @dev Buy XXX Coins for all commission and burn
  ///      them (can ONLY be decided by a vote).
  function burnTokens() external onlyRole(DAO) {
    uint256 balance = address(this).balance;
    address[] memory path = new address[](2);
    path[0] = wethAddress;
    path[1] = xxxTokenAddress;

    uint256[] memory minOutAmounts = uniV2Router.getAmountsOut(balance, path);

    uniV2Router.swapExactETHForTokens{ value: balance }(
      minOutAmounts[1],
      path,
      address(this),
      block.timestamp
    );

    xxxToken.burn(address(this), minOutAmounts[1]);
  }

  /// @dev Change referer trade commission (can ONLY be decided by a vote).
  function setRefererTradeCommission(uint256 _value) external onlyRole(DAO) {
    refererTradeCommission = _value;
  }

  /// @dev Change 1st referer sale commission (can ONLY be decided by a vote).
  function setRefererOneCommission(uint256 _value) external onlyRole(DAO) {
    refererOneCommission = _value;
  }

  /// @dev Change 2nd referer sale commission (can ONLY be decided by a vote).
  function setRefererTwoCommission(uint256 _value) external onlyRole(DAO) {
    refererTwoCommission = _value;
  }

  function nextPrice(uint256 price) internal pure returns (uint256) {
    uint256 newPrice = ((price * 3) / 100) + 4000000;
    return newPrice;
  }
}
