module.exports.config = {
  name: `${global.config.BOTNAME}`,
  version: "1.1.0",
  permission: 0,
  credits: "mtx",
  description: "",
  prefix: false,
  category: "ai",
  usage: `${global.config.BOTNAME} (question)`,
  cooldowns: 3,
  dependency: {
    "axios": ""
  }
};

module.exports.run = async function ({api, event, args}) {
  try{
  const axios = require('axios');
  const {sensui} = global.apimtx
  let ask = args.join(' ');
  if (!ask) {
    return api.sendMessage('please provide a question.', event.threadID, event.messageID)
  }
  const res = await axios.get(`${sensui}api/tools/ai?question=${ask}`);
  const reply = res.data.answer;
  if (res.error) {
    return api.sendMessage('having some unexpected error while fetching api.', event.threadID, event.messageID)
  } else {
    return api.sendMessage(reply, event.threadID, event.messageID)
  }
  } catch (error) {
    return api.sendMessage('having some unexpected error', event.threadID, event.messageID)
  }
}