const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  permission: 0,
  credits: "RICKICEL api sensui",
  description: "generate temporary email or fetch inbox messages",
  prefix: false,
  category: "generate",
  usages: "to generate email: <tempmail gen>, to see inbox: <tempmail inbox> <generated email>",
  cooldowns: 5,
};

const TEMP_MAIL_URL = 'https://tempmail-api.codersensui.repl.co/api/gen';

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] === 'inbox') {
      if (!args[1]) {
        return api.sendMessage("❌ Please provide an email address for the inbox.", event.threadID);
      }
      
      const emailAddress = args[1];
      const inboxResponse = await axios.get(`https://tempmail-api.codersensui.repl.co/api/getmessage/${emailAddress}`);
      const messages = inboxResponse.data.messages;

      if (!messages || messages.length === 0) {
        return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID);
      }

      let messageText = '📬 Inbox Messages: 📬\n\n';
      for (const message of messages) {
        messageText += `📩 :「 Sender 」: ${message.sender}\n`;
        messageText += `🌷 :「 Subject 」: ${message.subject}\n✎……………………………………………………\n`;
      }

      api.sendMessage(messageText, event.threadID);
    } else {
      const tempMailResponse = await axios.get(TEMP_MAIL_URL);
      const tempMailData = tempMailResponse.data;

      if (!tempMailData.email) {
        return api.sendMessage("❌ Failed to generate temporary email.", event.threadID);
      }

      api.sendMessage(`☑ ❲ here's your email ❳\n\n${tempMailData.email}`, event.threadID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("❯ no messages found in the current email\n❯ usage:\nto generate tempmail use [tempmail gen] to see tempmail inbox use [tempmail inbox] [your generated email here]", event.threadID);
  }
};