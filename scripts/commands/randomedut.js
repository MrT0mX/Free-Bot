module.exports.config = {
	name:"haruedit",
	version: "1",
	hasPermssion: 0,
	credits: "haru",
	description: "Edit video from tiktok",
  usePrefix: false,
	commandCategory: "media",
	cooldowns: 10
};
module.exports.run = async ({ api, event,}) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	
  api.sendMessage(`⏱️ | video is sending please wait...`, event.threadID, event.messageID);
axios.get('https://api-edit-alightmotion.jonellmagallanes400.repl.co/cc/?apikey=editor').then(res => {
	let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
	let callback = function () {
					api.sendMessage({
                                                body: ` Random Edit From Tiktok`,
						attachment: fs.createReadStream(__dirname + `/cache/edit.mp4`)
					}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/edit.mp4`), event.messageID);
				};
				request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/edit.mp4`)).on("close", callback);
			}) .catch(err => {
                     api.sendMessage("[ EDIT ]\nApi error status: 200\nContact the owner to fix immediately🛠", event.threadID, event.messageID);
    api.setMessageReaction("❌", event.messageID, (err) => {}, true);
                  })     
}
          