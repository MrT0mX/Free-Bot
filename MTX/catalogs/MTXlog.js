const chalk = require("chalk");
const gradient = require("gradient-string");
const chalkAnimation = require("chalkercli");
const color = gradient("blue", "purple");
const crayon = gradient("yellow", "lime", "green");
const blu = gradient("#243aff", "#4687f0", "#5800d4");
const sky = gradient("#0905ed", "#346eeb", "#344feb");

module.exports = (text, type) => {
  switch (type) {
    case "warn":
      process.stderr.write(color(`warn - `) + text + "\n");
      break;
    case "error":
      process.stderr.write(
        chalk.bold.hex("#ff0000").bold(`error - `) + text + "\n"
      );
      break;
    case "load":
      process.stderr.write(blu(`new user - `) + text + "\n");
      break;
    default:
      process.stderr.write(sky(`${String(type)} - `) + text + "\n");
      break;
  }
};
module.exports.error = (text, type) => {
  process.stderr.write(chalk.hex("#ff0000")(`error - `) + text + "\n");
};

module.exports.err = (text, type) => {
  process.stderr.write(chalk.hex("#ff0000")(`error - `) + text) + "\n";
};

module.exports.warn = (text, type) => {
  process.stderr.write(chalk.yellow(`warn - `) + text + "\n");
};

module.exports.loader = (data, option) => {
  switch (option) {
    case "warn":
      process.stderr.write(crayon(`warn - `) + data + "\n");
      break;
    case "error":
      process.stderr.write(chalk.hex("#ff0000")(`error - `) + data + "\n");
      break;
    default:
      process.stderr.write(blu(`MrTomXxX - `) + data + "\n");
      break;
  }
};
