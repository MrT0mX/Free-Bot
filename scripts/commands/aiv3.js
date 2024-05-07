module.exports.config = {
  name: `aiv3`,
  version: "1.1.0",
  permission: 0,
  credits: "Who is Deku?",
  description: "ask ai",
  prefix: false,
  category: "ai",
  usage: `(ask)`,
  cooldowns: 3
};

module.exports.run = async ({ event, api, args }) => {
  let ask = args.join(" ");
  const axios = require('axios');
  const { threadID, messageID } = event;
  if (!ask) return api.sendMessage('Missing question, please provide a question', threadID, messageID);
  api.sendMessage("⏳Getting the answer...", threadID, messageID)
  try {
    axios.get(encodeURI(`https://free-api.ainz-sama101.repl.co/others/gpt?prompt=${ask}`)).then(res => {
      const reply = res.data.result;
        return api.sendMessage(reply, threadID, messageID);
      })
} catch (error) {
    return api.sendMessage(error, event.threadID, event.messageID)
  }
                  }