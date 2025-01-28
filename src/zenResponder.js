import { ethers } from 'ethers';
import { ZEN_MASTER_ABI, CONTRACT_ADDRESSES } from './contractConfig.js';

export class ZenResponder {
  constructor(twitterClient, openai, wallet) {
    this.twitterClient = twitterClient;
    this.openai = openai;
    this.wallet = wallet;
    this.zenMasterContract = new ethers.Contract(
      CONTRACT_ADDRESSES.ZEN_MASTER,
      ZEN_MASTER_ABI,
      wallet
    );
  }

  async generateResponse(tweet) {
    const prompt = `As a contemporary Zen Master, provide a calm and insightful response to: "${tweet.text}"
    Focus on digital age wisdom, mindfulness, and practical guidance. Keep it under 280 characters.
    Also rate the depth and meaningfulness of the question on a scale of 0-100.`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    // Extract wisdom score from response
    const wisdomScore = this.extractWisdomScore(response);
    return { response, wisdomScore };
  }

  extractWisdomScore(response) {
    // Implement logic to extract wisdom score from GPT response
    // This is a simplified example
    return Math.floor(Math.random() * 100);
  }

  async respondToMention(tweet) {
    try {
      const { response, wisdomScore } = await this.generateResponse(tweet);
      await this.twitterClient.v2.reply(response, tweet.id);
      
      // Record interaction and potentially reward wisdom
      await this.handleInteraction(tweet, wisdomScore);
    } catch (error) {
      console.error('Error responding to tweet:', error);
    }
  }

  async handleInteraction(tweet, wisdomScore) {
    try {
      // Record the interaction on Base L2
      const tx = await this.zenMasterContract.interact(tweet.id, {
        value: ethers.parseEther("0.001")
      });
      await tx.wait();

      // If wisdom score is high enough, reward with ZEN tokens
      if (wisdomScore >= 80) {
        const rewardAmount = ethers.parseEther("10"); // 10 ZEN tokens
        const rewardTx = await this.zenMasterContract.rewardWisdom(
          tweet.author_id,
          rewardAmount,
          tweet.id
        );
        await rewardTx.wait();
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
    }
  }
}
