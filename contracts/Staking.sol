// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./XXXToken.sol";
import "./interfaces/IUniswapV2Pair.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @title A simple ERC-20 staking contract for the Uniswap testnet.
/// @author Sfy Mantissa
contract Staking is AccessControl {

  /// @dev Role for DAO.
  bytes32 public constant DAO = keccak256("DAO");

  struct Stake {
    uint256 balance;
    uint256 stakeStartTimestamp;
    uint256 stakeEndTimestamp;
    uint256 lastClaimTimestamp;
  }

  /// @notice Get user's stake data.
  /// @dev balance is current amount of tokens staked by user.
  ///      stakeStartTimestamp is the UNIX timestamp of last stake
  ///      made by the user.
  ///      stakeEndTimestamp is the UNIX timestamp of the user
  ///      calling claim().
  ///      claimedReward is the flag to tell whether the
  ///      user already claimed the reward.
  mapping(address => Stake) public stakeOf;

  /// @notice Used to implement a compact address whitelist.
  bytes32 public merkleRoot;

  /// @notice Get the stake token address.
  address public stakeTokenAddress;

  /// @notice Get the reward token address.
  address public rewardTokenAddress;

  /// @notice Get the percentage of staked tokens which is returned every
  ///         rewardInterval as reward tokens.
  uint256 public rewardPercentage;

  /// @notice Get the interval for reward returns.
  uint256 public rewardInterval;

  /// @notice Get the interval for which `claim()`
  ///         function remains unavailable.
  uint256 public lockInterval;

  /// @notice Gets triggered when tokens are staked by the account.
  event Staked(address from, uint256 amount);

  /// @notice Gets triggered when tokens are unstaked by the account.
  event Unstaked(address to, uint256 amount);

  /// @notice Get triggered when the reward is claimed by the account.
  event Claimed(address to, uint256 amount);

  /// @notice All constructor params are actually set in config.ts.
  constructor(
    bytes32 _merkleRoot,
    address _stakeTokenAddress,
    address _rewardTokenAddress,
    uint256 _rewardPercentage,
    uint256 _rewardInterval,
    uint256 _lockInterval
  ) {
    merkleRoot = _merkleRoot;
    stakeTokenAddress = _stakeTokenAddress;
    rewardTokenAddress = _rewardTokenAddress;
    rewardPercentage = _rewardPercentage;
    rewardInterval = _rewardInterval;
    lockInterval = _lockInterval;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /// @notice Allows the user to stake a specified `amount` of tokens.
  /// @param _amount The amount of tokens to be staked.
  /// @param _merkleProof Proof that msg.sender is in the merkle tree.
  function stake(uint256 _amount, bytes32[] calldata _merkleProof) external {
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(
      MerkleProof.verify(_merkleProof, merkleRoot, leaf),
      "ERROR: caller is not in the whitelist."
    );

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

  /// @notice Allows the user to unstake all staked tokens.
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

  /// @notice Allows the user to claim the reward.
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

  /// @notice Allows to change the lockInterval via DAO voting.
  /// @param _value The new lockInterval value.
  function changeLockInterval(uint256 _value) external onlyRole(DAO) {
    lockInterval = _value;
  }

  /// @notice Change the merkle tree root.
  /// @param _merkleRoot New merkle root.
  function changeMerkleRoot(bytes32 _merkleRoot) external onlyRole(DAO) {
    merkleRoot = _merkleRoot;
  }
}
