// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.8;

import "./Staking.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title A DAO proposal voting implementation with ERC-20 tokens.
/// @author Sfy Mantissa
contract DAOVoting is AccessControl {

    using Counters for Counters.Counter;
    Counters.Counter private proposalId;

    /// @dev Chairman role (primarily for proposal creation).
    bytes32 public constant CHAIRMAN = keccak256("CHAIRMAN");

    /// @dev DAO role (executes changes which get voted for).
    bytes32 public constant DAO = keccak256("DAO");

    /// @dev Mapping of users to the proposals in which they've recently voted.
    ///      Needed for the withdrawal logic to function correctly.
    mapping(address => uint256) public userToLastProposalId;

    /// @dev List of proposals is stored on-chain.
    mapping(uint256 => Proposal) public proposals;

    struct Proposal {                           
        mapping(address => bool) voterHasVoted; 
        uint256 startTimeStamp;                 
        uint256 voteCount;                      
        uint256 positiveVoteCount;              
        bool isFinished;                        
        address recipient;                      
        string description;                     
        bytes callData;                         
    }

    /// @dev The instance of token, which is used to make votes.
    ///      1 vote == 1 token.
    IERC20 public token;

    /// @dev Staking contract used to deposit tokens.
    Staking public staking;

    /// @dev Minimum amount of votes required to consider the vote successful.
    uint256 public minimumQuorum;

    /// @dev Time period in which new votes are accepted (in seconds).
    uint256 public debatingPeriodDuration;

    /// @dev Must trigger when new proposals are added by the chairman.
    event ProposalAdded(
      uint256 proposalId,
      string description,
      uint256 startTimeStamp,
      address recipient
    );

    /// @dev Must trigger when new votes are casted by the user.
    event VoteCasted(
      uint256 proposalId,
      address voter,
      bool decision,
      uint256 votes
    );

    /// @dev Must trigger when a proposal is finished.
    event ProposalFinished(
      uint256 proposalId,
      string description,
      bool decision,
      uint256 positiveVoteCount,
      uint256 voteCount
    );

    /// @dev Some initial values are set in the constructor.
    /// @param _voteToken Address of the token used to cast votes.
    /// @param _minimumQuorum Minimal amount of votes.
    /// @param _debatingPeriodDuration Voting period in seconds.
    constructor
    (
        address _voteToken,
        address _stakingAddress,
        uint256 _minimumQuorum,
        uint256 _debatingPeriodDuration
    )
    {
        _setupRole(CHAIRMAN, msg.sender);
        _setupRole(DAO, address(this));
        token = IERC20(_voteToken);
        staking = Staking(_stakingAddress);
        minimumQuorum = _minimumQuorum;
        debatingPeriodDuration = _debatingPeriodDuration;
    }

    /// @dev Used to add new proposals.
    ///      Can only be called by the chairman.
    ///      Emits `ProposalAdded`.
    /// @param _callData Function signature used if the vote succeeded.
    /// @param _recipient Address of the contract to use the `_callData` upon.
    /// @param _description General description of proposed change.
    function addProposal
    (
      bytes memory _callData,
      address _recipient,
      string memory _description
    ) 
      external
    {
      require(
        hasRole(CHAIRMAN, msg.sender), 
        "ERROR: Caller is not the chairman."
      );

      proposalId.increment();
      Proposal storage proposal = proposals[proposalId.current()];

      uint256 startTimeStamp = block.timestamp;
      proposal.startTimeStamp = startTimeStamp;
      proposal.recipient = _recipient;
      proposal.description = _description;
      proposal.callData = _callData;

      emit ProposalAdded(
          proposalId.current(),
          _description,
          startTimeStamp,
          _recipient
      );
    }

    /// @dev Used to cast votes by users.
    ///      Emits `VoteCasted`.
    /// @param _proposalId The ID of the proposal.
    /// @param _decision `true` if user votes `for`, `false` otherwise.
    function vote
    (
      uint256 _proposalId,
      bool _decision
    ) 
      external 
    {
      Proposal storage proposal = proposals[_proposalId];

      require(
          proposalId.current() >= _proposalId,
          "ERROR: No proposal with such ID."
      );

      require(
          !proposal.isFinished,
          "ERROR: This proposal voting is already finished."
      );

      require(
          block.timestamp <= proposal.startTimeStamp + debatingPeriodDuration,
          "ERROR: This proposal voting no longer accepts new votes."
      );

      require(
          !proposal.voterHasVoted[msg.sender],
          "ERROR: You can only vote once."
      );

      uint256 votes;
      (votes,,,) = staking.stakeOf(msg.sender);

      require(votes > 0, "ERROR: No tokens staked.");

      userToLastProposalId[msg.sender] = _proposalId;
      proposal.voteCount += votes;
      proposal.voterHasVoted[msg.sender] = true;
      if (_decision) proposal.positiveVoteCount += votes;

      emit VoteCasted(_proposalId, msg.sender, _decision, votes);
    }

    /// @dev Used to finish the proposal voting.
    ///      Unlike `addProposal` may be called by anyone.
    ///      Emits `ProposalFinished`.
    /// @param _proposalId The ID of the proposal.
    function finishProposal(uint256 _proposalId)
      external
    {
      Proposal storage proposal = proposals[_proposalId];

      require(
          proposalId.current() >= _proposalId,
          "ERROR: No proposal with such ID."
      );
      require(
          block.timestamp > proposal.startTimeStamp + debatingPeriodDuration,
          "ERROR: Proposal voting cannot be finished prematurely."
      );

      require(
          !proposal.isFinished,
          "ERROR: This proposal voting is already finished."
      );

      bool decision;
      uint256 negativeVoteCount = proposal.voteCount -
          proposal.positiveVoteCount;

      if (
          proposal.voteCount >= minimumQuorum &&
          proposal.positiveVoteCount > negativeVoteCount
      ) {
          callFunction(proposal.recipient, proposal.callData);
          decision = true;
      } else {
          decision = false;
      }
      proposal.isFinished = true;

      emit ProposalFinished(
          _proposalId,
          proposal.description,
          decision,
          proposal.positiveVoteCount,
          proposal.voteCount
      );
    }

    /// @dev Used to change the minimumQuorum value.
    ///      Can only be called by the chairman or DAO.
    /// @param _value The new minimumQuorum value.
    function setMinimumQuorum(uint256 _value)
      external
    {
      require(
        hasRole(CHAIRMAN, msg.sender) || hasRole(DAO, msg.sender), 
        "ERROR: Caller is not the chairman or DAO."
      );

        minimumQuorum = _value;
    }

    /// @dev Used to change the debatingPeriodDuration value.
    ///      Can only be called by the chairman or DAO.
    /// @param _value The new debatingPeriodDuration value.
    function setDebatingPeriodDuration(uint256 _value)
      external
    {
      require(
        hasRole(CHAIRMAN, msg.sender) || hasRole(DAO, msg.sender), 
        "ERROR: Caller is not the chairman or DAO."
      );

        debatingPeriodDuration = _value;
    }

    function callFunction
    (
      address recipient,
      bytes memory signature
    )
      internal 
    {
      (bool success, ) = recipient.call(signature);
      require(success, "ERROR: External function call by signature failed.");
    }

}
