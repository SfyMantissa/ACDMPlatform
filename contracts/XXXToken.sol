// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ERC20 token for the ACDM Platform project.
/// @author Sfy Mantissa
contract XXXToken is ERC20, AccessControl {

  /// @dev Role which will be able to call `mint` and `burn`.
  bytes32 public constant MANIPULATOR_ROLE = keccak256("MANIPULATOR_ROLE");

  /// @dev Deployer is set as the default admin.
  constructor() ERC20("XXX Coin", "XXX") {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(MANIPULATOR_ROLE, msg.sender);
  }

  /// @dev Mint tokens to `account` in quantity `amount`.
  /// @param account Address of the receiving account.
  /// @param amount Quantity of tokens to mint.
  function mint(address account, uint256 amount)
    external
    onlyRole(MANIPULATOR_ROLE)
  {
    _mint(account, amount);
  }

  /// @dev Burn tokens from `account` in quantity `amount`.
  /// @param account Address of the burned account.
  /// @param amount Quantity of tokens to burn.
  function burn(address account, uint256 amount)
    external
    onlyRole(MANIPULATOR_ROLE)
  {
    _burn(account, amount);
  }

}
