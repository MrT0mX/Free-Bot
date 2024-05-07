module.exports.config = {
  name: "update",
  eventType: ["log:unsubscribe"],
  version: "beta",
  credits: "MTX",
  description: "automatically delete data time join user when out",
};
const fs = require("fs");
var path = __dirname + "/../commands/system/timejoin.json";
module.exports.run = async function ({ event: e }) {
  const logger = require("../../MTX/catalogs/MTXlog.js");
  const { threadID: t, logMessageData: l } = e,
    { writeFileSync: w, readFileSync: r } = fs,
    { stringify: s, parse: p } = JSON;
  var v = l.leftParticipantFbId;
  let a = p(r(path));
  a[v + t] = "";
  w(path, s(a, null, 2));
  logger("updated database successfully\n", "database");
};
