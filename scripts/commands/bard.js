const axios = require("axios");
const fs = require('fs-extra');

module.exports.config = {
    name: "bard",
    version: "1.0",
    permission: 0,
    credits: "SiAM | @Siam.The.Fox",
    description: "generate ai response bard\nsupport image reply",
    prefix: false,
    category: "ai",
    usages: "prompt",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("Please provide a prompt. Usage: bard [prompt]", event.threadID, event.messageID);

    const cookie = '';

    let params = {
        prompt: encodeURIComponent(prompt),
        cookie: cookie,
        attImage: "",
    };

    if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
        params.attImage = encodeURIComponent(event.messageReply.attachments[0].url);
    }

    try {
        const response = await axios.get("https://api.siambardproject.repl.co/getBard", { params: params });
        const result = response.data;

        let content = result.answer;
        let attachment = [];

        if (result.attachment && result.attachment.length > 0) {
            const data = result.attachment;
            let number = 0;
            const link = [];

            for (let i = 0; i < data.length; i++) {
                const path = __dirname + `/tmp/${number += 1}.jpg`;
                const getDown = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
                fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
                img.push(fs.createReadStream(path));
            }

            attachment = link;

            api.sendMessage({
                body: content,
                attachment: attachment,
            }, event.threadID, event.messageID, async () => {
                
                for (let ii = 1; ii < number; ii++) {
                    fs.unlinkSync(__dirname + `/tmp/${ii}.png`);
                }
            });
        } else {
            
            api.sendMessage(content, event.threadID, event.messageID);
        }
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("Error...", event.threadID, event.messageID);
    }
};