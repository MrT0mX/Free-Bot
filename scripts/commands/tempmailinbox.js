const axios = require('axios');

module.exports.config = {
  name: "inbox",
  version: "1.0.0",
  credits: "RICKCIEL",
  permission: 0,
  prefix: false,
  description: "Fetch and display inbox messages from tempmail",
  category: "generate",
  usages: "<tempmail email>",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const emailAddress = args[0];
    const inboxResponse = await axios.get(`https://tempmail-api.codersensui.repl.co/api/getmessage/${emailAddress}`);
    const messages = inboxResponse.data.messages;

    if (!messages || messages.length === 0) {
      return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID);
    }

    let messageText = '📬 Inbox Messages: 📬\n\n';
    for (const message of messages) {
      messageText += `📩 Sender: ${message.sender}\n`;
      messageText += `👀 Subject: ${message.subject || '👉 NO SUB'}\n`;
      messageText += `📩 Message: ${message.message}\n\n`;
    }

    api.sendMessage(messageText, event.threadID);
  } catch (error) {
    console.error('Error fetching inbox:', error);
    api.sendMessage("❌ An error occurred while fetching the inbox.", event.threadID);
  }
};