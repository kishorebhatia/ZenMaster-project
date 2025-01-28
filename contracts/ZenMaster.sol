// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ZenToken.sol";

contract ZenMaster is Ownable {
    ZenToken public zenToken;
    uint256 public constant INTERACTION_FEE = 0.001 ether;
    mapping(address => uint256) public userInteractions;
    mapping(address => bool) public acceptedTokens;
    
    event InteractionRecorded(address user, string tweetId, uint256 timestamp);
    event WisdomRewarded(address user, uint256 amount, string tweetId);
    
    constructor(address _zenTokenAddress) Ownable(msg.sender) {
        zenToken = ZenToken(_zenTokenAddress);
    }
    
    function setAcceptedToken(address token, bool accepted) external onlyOwner {
        acceptedTokens[token] = accepted;
    }
    
    function interact(string calldata tweetId) external payable {
        require(msg.value >= INTERACTION_FEE, "Insufficient fee");
        userInteractions[msg.sender]++;
        emit InteractionRecorded(msg.sender, tweetId, block.timestamp);
    }
    
    function interactWithToken(string calldata tweetId, address token, uint256 amount) external {
        require(acceptedTokens[token], "Token not accepted");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        userInteractions[msg.sender]++;
        emit InteractionRecorded(msg.sender, tweetId, block.timestamp);
    }
    
    function rewardWisdom(address user, uint256 amount, string calldata tweetId) external onlyOwner {
        require(zenToken.transfer(user, amount), "Reward transfer failed");
        emit WisdomRewarded(user, amount, tweetId);
    }
    
    function withdrawFees() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    function withdrawTokens(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(IERC20(token).transfer(owner(), balance), "Token withdrawal failed");
    }
}
