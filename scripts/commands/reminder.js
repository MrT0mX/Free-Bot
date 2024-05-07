module.exports.config = {
	name: "reminder",
	version: "0.0.1",
	permission: 0,
	credits: "mtx",
	prefix: true,
	description: "notification",
	category: "system",
	usages: "[Time] [Text] ",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  
	const time = args[0];
	const text = args.join(" ").replace(time, "");
  if ((this.config.credits) != `mtx`) { return api.sendMessage(`please don't change the credits.`, event.threadID, event.messageID)};
	if (isNaN(time)) return api.sendMessage(`how to use?\nreminder [time] [text]\n\nexample:\nreminder 60 this bot was made by yrei\n\ntake note:\n59 is equal to second\n60 is equal to minute to make a minute remind please use long numbers\n\nexample for minutes :\nreminder 99999 [text]\n99999 is equal to 16 minutes`, event.threadID, event.messageID);
	const display = time > 59 ? `${time / 60} minute` : `${time} second`;
	api.sendMessage(`i'll remind you later after ${display}`, event.threadID, event.messageID);
	await new Promise(resolve => setTimeout(resolve, time * 1000));
	var value = await api.getThreadInfo(event.threadID);
	if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.senderID)).name;
	else value = (value.nicknames)[event.senderID];
	return api.sendMessage({
	body: `${(text) ? value + ",\nreminder : " + text : value + ", i think you asked me to remind you to do something, right?"}`,
		mentions: [{
			tag: value,
			id: event.senderID
		}]
	}, event.threadID, event.messageID);
}