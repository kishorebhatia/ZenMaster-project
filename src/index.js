import { TwitterApi } from 'twitter-api-v2';
import { config } from 'dotenv';
import { OpenAI } from 'openai';
import { ethers } from 'ethers';
import { ZenResponder } from './zenResponder.js';
import { setupTwitterStream } from './twitterStream.js';

config();

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const zenResponder = new ZenResponder(twitterClient, openai, wallet);
setupTwitterStream(twitterClient, zenResponder);
