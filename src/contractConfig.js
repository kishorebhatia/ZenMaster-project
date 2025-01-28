export const ZEN_MASTER_ABI = [
  "function interact(string calldata tweetId) external payable",
  "function interactWithToken(string calldata tweetId, address token, uint256 amount) external",
  "function rewardWisdom(address user, uint256 amount, string calldata tweetId) external",
  "event InteractionRecorded(address user, string tweetId, uint256 timestamp)",
  "event WisdomRewarded(address user, uint256 amount, string tweetId)"
];

export const ZEN_TOKEN_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];

export const CONTRACT_ADDRESSES = {
  ZEN_MASTER: "YOUR_DEPLOYED_ZEN_MASTER_ADDRESS",
  ZEN_TOKEN: "YOUR_DEPLOYED_ZEN_TOKEN_ADDRESS"
};
