const Ably = require("ably");

let ablyClient;

const getAblyClient = () => {
  if (ablyClient) return ablyClient;
  if (!process.env.ABLY_API_KEY) return null;

  ablyClient = new Ably.Rest(process.env.ABLY_API_KEY);
  return ablyClient;
};

const publishAblyEvent = async (channelName, eventName, payload) => {
  const client = getAblyClient();
  if (!client) return;

  await client.channels.get(channelName).publish(eventName, payload);
};

module.exports = {
  publishAblyEvent,
};
