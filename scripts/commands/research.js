module.exports.config = {
  name: "research",
  version: "1.0.0",
  permssion: 0,
  credits: "JOHN RÉ PORAS",//modified by NtrEms, don't change the credits!
  description: "search and retrieve research papers from researchgate",
  prefix: false,
  category: "study",
  usages: "[title]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const axios = global.nodemodule["axios"];
  const google = require("googlethis");
  let query = args.join(" ");
  const options = {
    page: 0,
    safe: false,
    additional_params: {
      hl: "en",
    },
  };

  if (!query) {
    return api.sendMessage("Search query cannot be left blank!", event.threadID);
    api.setMessageReaction("❌", event.messageID, (err) => {}, true);
  }

  api.sendMessage(`🔎Searching for "${query}"...`, event.threadID, event.messageID);
   api.setMessageReaction("🔎", event.messageID, (err) => {}, true);

  const response = await google.search(`site:researchgate.net ${query}`, options);

  let results = "";
  for (let i = 0; i < 5; i++) {
    let title = response.results[i].title;
    let author = response.results[i].description;
    let link = response.results[i].url + ".pdf";
    results += `\n📄 RESEARCH PAPER ${i + 1}:\n\TITLE: ${title}\n\nDESCRIPTION: ${author}\n\nLINK: [DOWNLOAD ∇ PDF!] (${link})\n\n`;
  }

  api.sendMessage(results, event.threadID, event.messageID);
};
  