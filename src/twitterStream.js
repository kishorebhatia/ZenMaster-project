export async function setupTwitterStream(client, responder) {
  const rules = await client.v2.streamRules();
  
  if (rules.data?.length) {
    await client.v2.updateStreamRules({
      delete: { ids: rules.data.map(rule => rule.id) }
    });
  }

  await client.v2.updateStreamRules({
    add: [{ value: '@YourBotUsername' }]
  });

  const stream = await client.v2.searchStream({
    'tweet.fields': ['referenced_tweets', 'author_id'],
    expansions: ['referenced_tweets.id'],
  });

  stream.on('data', async tweet => {
    if (tweet.data.referenced_tweets?.some(ref => ref.type === 'replied_to')) {
      await responder.respondToMention(tweet.data);
    }
  });

  stream.on('error', error => {
    console.error('Stream error:', error);
  });
}
