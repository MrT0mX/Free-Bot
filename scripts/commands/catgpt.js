const axios = require('axios');

module.exports.config = {
  name: "catgpt",
  version: "1.0.0",
  permission: 0,
  credits: "Minn", //don't change please:(( explore explore din mga site/apis jan, wag puro chage credits
  description: "chat with catgpt",
  prefix: false,
  category: "ai",
  usages: "<text>",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const q = args.join(" "); api.sendMessage("🔍😺 | searching your answer", event.threadID, event.messageID);
  try {
    const response = await axios.post("https://catgpt.guru/api/chat", {
      messages: [
        {
          role: "user",
          content: q,
        },
      ],
    });
    api.sendMessage(response.data, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage('catgpt didn\'t meow back:(', event.threadID, event.messageID);
  }
};
