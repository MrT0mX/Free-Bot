module.exports.config = {
  name: "help",
  version: "1.0.2",
  permission: 0,
  credits: "mtx",
  description: "beginner's guide",
  prefix: true,
  category: "guide",
  usages: "[command name]",
  cooldowns: 5,
  envConfig: {
		autoUnsend: false,
		delayUnsend: 60
	}
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ usage : %3\n❯ category : %4\n❯ waiting time : %5 seconds(s)\n❯ permission : %6\n\n» module code by %7",
    helpList:
      `➤ there are %1 commands & %2 categories\n\n╭ ───«~»─── ╮
│          GUIDE         │
╰ ───«~»─── ╯\n➤ use : "${global.config.PREFIX}${this.config.name} ‹command›" to know how to use the command\n➤ type : "${global.config.PREFIX}${this.config.name} ‹page_number›" to show the page contents\n……………………………………\n‣ bot owner : ${global.config.OPERATORNAME}\n‣ owner fbl : ${global.config.OPERATORLINK}\n……………………………………\n\n`,
    user: "user",
    adminGroup: "group admin",
    adminBot: "bot admin",
  },
};


module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;  

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0)
    return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages ? command.config.usages : ""
      }`,
      command.config.category,
      command.config.cooldowns,
      command.config.permission === 0
        ? getText("user")
        : command.config.permission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(commandList.map((cmd) => cmd.config.category.toLowerCase()));
    const categoryCount = categories.size;

    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (
        !isNaN(parsedPage) &&
        parsedPage >= 1 &&
        parsedPage <= totalPages
      ) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `➤ Oops! You went too far! Please choose a page between 1 and ${totalPages}`,
          threadID,
          messageID
        );
      }
    }
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) =>
          cmd.config.category.toLowerCase() === category
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      const numberFont = [
        "❶",
        "❷",
        "❸",
        "❹",
        "❺",
        "❻",
        "❼",
        "❽",
        "❾",
        "❿",
      ];
      msg += `[ ${numberFont[i]} ]─❍ ${
        category.charAt(0).toLowerCase() + category.slice(1)
      } category\n   ❯ ${commandNames.join("\n   ❯ ")}\n\n`;
    }
    const numberFontPage = [
      "❶",
      "❷",
      "❸",
      "❹",
      "❺",
      "❻",
      "❼",
      "❽",
      "❾",
      "❿",
      "⓫",
      "⓬",
      "⓭",
      "⓮",
      "⓯",
      "⓰",
      "⓱",
      "⓲",
      "⓳",
      "⓴",
    ];
    msg += `╭ ───«~»─── ╮
│     Page ${numberFontPage[currentPage - 1]} of ${numberFontPage[totalPages - 1]}   │\n╰ ───«~»─── ╯\n➤ total pages available: ${totalPages}\n`;
    msg += getText("helpList", commands.size, categoryCount, prefix);

    const axios = require("axios");
    const fs = require("fs-extra");
    const imgP = [];
    const img = [
      "https://i.ibb.co/ZLnvPwQ/Picsart-23-07-24-11-03-50-602.png"
    ];
    const path = __dirname + "/cache/menu.png";
    const rdimg = img[Math.floor(Math.random() * img.length)];

    const { data } = await axios.get(rdimg, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imgP.push(fs.createReadStream(path));
    const msgg = {
  body: `╭ ──────«~»────── ╮
│   commands and categories  │
╰ ──────«~»────── ╯\n\n`+ msg + `\n\n`
    };

    const sentMessage = await api.sendMessage(msgg, threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
				return api.unsendMessage(info.messageID);
			} else return;
		}, messageID);
  } else {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages ? command.config.usages : ""
        }`,
        command.config.category,
        command.config.cooldowns,
        command.config.permission === 0
          ? getText("user")
          : command.config.permission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
				return api.unsendMessage(info.messageID);
			} else return;
		}, messageID);
  }
};
