module.exports.config = {
  name: "sketch",
  version: "1.0.0",
  permssion: 0,
  credits: "deku",
  description: "sketch images",
  prefix: false,
  category: "graphic",
  usages: "[url/reply to image]",
  cooldowns: 5, 
};

module.exports.run = async function({ api, event, args }) {
const fs = require("fs"),
axios = require("axios");
let url = args.join(" ") || event.messageReply.attachments[0].url;
const res = await axios.get("https://sim.ainz-project.repl.co/others/imgsketch?", {
                params: {
                    url: encodeURIComponent(url),
                    apikey: "deku"
                }
  });
// const data = res.data.result;
    let img1 = res.data.result.img1;
    let img2 = res.data.result.img2;
   let img3 = res.data.result.img3;
   let img4 = res.data.result.img4;
   let img5 = res.data.result.img1;

    let imgs1 = (await axios.get(img1, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img1.png", Buffer.from(imgs1, "utf-8"));

    let imgs2 = (await axios.get(img2, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img2.png", Buffer.from(imgs2, "utf-8"));

let imgs3 = (await axios.get(img3, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img3.png", Buffer.from(imgs3, "utf-8"));

let imgs4 = (await axios.get(img4, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img4.png", Buffer.from(imgs4, "utf-8"));

let imgs5 = (await axios.get(img5, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/img5.png", Buffer.from(imgs5, "utf-8"));

    var allimage = [];

allimage.push(fs.createReadStream(__dirname + "/cache/img1.png"));

allimage.push(fs.createReadStream(__dirname + "/cache/img2.png"));

allimage.push(fs.createReadStream(__dirname + "/cache/img3.png"));

allimage.push(fs.createReadStream(__dirname + "/cache/img4.png"));

allimage.push(fs.createReadStream(__dirname + "/cache/img5.png"));

return api.sendMessage({body: "Showing 5 results", attachment: allimage }, event.threadID, event.messageID);
              }