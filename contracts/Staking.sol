// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./XXXToken.sol";
import "./interfaces/IUniswapV2Pair.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {

  struct Stake {
    uint256 balance;
    uint256 stakeStartTimestamp;
    uint256 stakeEndTimestamp;
    uint256 lastClaimTimestamp;
  }

  mapping(address => Stake) public stakeOf;
  address public stakeTokenAddress;
  address public rewardTokenAddress;
  uint256 public rewardPercentage;
  uint256 public rewardInterval;
  uint256 public lockInterval = 120;

  event Staked(address from, uint256 amount);
  event Unstaked(address to, uint256 amount);
  event Claimed(address to, uint256 amount);

  constructor(
    address _stakeTokenAddress,
    address _rewardTokenAddress,
    uint256 _rewardPercentage,
    uint256 _rewardInterval
  ) {
    stakeTokenAddress = _stakeTokenAddress;
    rewardTokenAddress = _rewardTokenAddress;
    rewardPercentage = _rewardPercentage;
    rewardInterval = _rewardInterval;
  }

  function stake(uint256 _amount) external {
    Stake storage _stake = stakeOf[msg.sender];

    IUniswapV2Pair(stakeTokenAddress).transferFrom(
      msg.sender,
      address(this),
      _amount
    );

    _stake.balance += _amount;
    _stake.stakeStartTimestamp = block.timestamp;

    emit Staked(msg.sender, _amount);
  }

  function unstake() external {
    Stake storage _stake = stakeOf[msg.sender];
    uint256 amount = _stake.balance;

    require(_stake.balance > 0, "ERROR: nothing is staked.");

    require(
      block.timestamp >= _stake.stakeStartTimestamp + lockInterval,
      "ERROR: must wait for lock interval to pass."
    );

    IUniswapV2Pair(stakeTokenAddress).transfer(msg.sender, amount);

    _stake.balance = 0;

    emit Unstaked(msg.sender, amount);
  }

  function claim() external {
    Stake storage _stake = stakeOf[msg.sender];

    uint256 numOfIntervals;

    if (_stake.lastClaimTimestamp == 0) {
      _stake.lastClaimTimestamp = block.timestamp;
      numOfIntervals =
        (_stake.lastClaimTimestamp - _stake.stakeStartTimestamp) /
        rewardInterval;
    } else {
      numOfIntervals =
        (block.timestamp - _stake.lastClaimTimestamp) /
        rewardInterval;
      _stake.lastClaimTimestamp = block.timestamp;
    }

    uint256 rewardPerInterval = (_stake.balance * rewardPercentage) / 100;
    uint256 reward = rewardPerInterval * numOfIntervals;

    XXXToken(rewardTokenAddress).mint(msg.sender, reward);

    emit Claimed(msg.sender, reward);
  }

  function changeRewardInterval(uint256 _value) external onlyOwner {
    rewardInterval = _value;
  }

  function changeLockInterval(uint256 _value) external onlyOwner {
    lockInterval = _value;
  }

  function changeRewardPercentage(uint256 _value) external onlyOwner {
    rewardPercentage = _value;
  }
}
