const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require("child_process");
const axios = require("axios");
const config = require("../../Config.json");
const chalk = require("chalk");
const listPackage = JSON.parse(readFileSync("../../package.json")).dependencies;
const packages = JSON.parse(readFileSync("../../package.json"));
const fs = require("fs");
const login = require("../system/login/index.js");
const moment = require("moment-timezone");
const logger = require("./MTXlog.js");
const gradient = require("gradient-string");
const process = require("process");
const listbuiltinModules = require("module").builtinModules;

global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  apimtxPath: new String(),
  mtxPath: new String(),
  getTime: function (option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Dhaka").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Dhaka").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Dhaka").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Dhaka").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Dhaka").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Dhaka").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Dhaka").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Dhaka").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
  timeStart: Date.now(),
});
global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array(),
});
global.utils = require("./MTXlisten.js");
global.loading = require("./MTXlog.js");
global.nodemodule = new Object();
global.config = new Object();
global.mtx = new Object();
global.apimtx = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();

const cheerful = gradient.fruit;
const crayon = gradient("yellow", "lime", "green");
const sky = gradient("#3446eb", "#3455eb", "#3474eb");
const BLUE = "#3467eb";
const errorMessages = [];
if (errorMessages.length > 0) {
  console.log("commands with errors : ");
  errorMessages.forEach(({ command, error }) => {
    console.log(`${command}: ${error}`);
  });
}
var apimtxValue;
try {
  global.client.apimtxPath = join(
    global.client.mainPath,
    "../configs/api.json"
  );
  apimtxValue = require(global.client.apimtxPath);
} catch (e) {
  return;
}
try {
  for (const apiKeys in apimtxValue)
    global.apimtx[apiKeys] = apimtxValue[apiKeys];
} catch (e) {
  return;
}
var mtxValue;
try {
  global.client.mtxPath = join(
    global.client.mainPath,
    "../configs/Config.json"
  );
  mtxValue = require(global.client.mtxPath);
} catch (e) {
  return;
}
try {
  for (const Keys in mtxValue) global.mtx[Keys] = mtxValue[Keys];
} catch (e) {
  return;
}
var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "../../Config.json");
  configValue = require(global.client.configPath);
  logger.loader(`deploying ${chalk.blueBright("MrTomXxX")} file`);
} catch (e) {
  return logger.loader(
    `cant read ${chalk.blueBright("MrTomXxX")} file`,
    "error"
  );
}
try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader(`deployed ${chalk.blueBright("MrTomXxX")} file`);
} catch (e) {
  return logger.loader(
    `can't deploy ${chalk.blueBright("MrTomXxX")} file`,
    "error"
  );
}
const { Sequelize, sequelize } = require("../system/database/index.js");
for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property);
  } catch (e) {}
}
const langFile = readFileSync(
  `${__dirname}/languages/${global.config.language || "en"}.lang`,
  {
    encoding: "utf-8",
  }
).split(/\r?\n|\r/);
const langData = langFile.filter(
  (item) => item.indexOf("#") != 0 && item != ""
);
for (const item of langData) {
  const getSeparator = item.indexOf("=");
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf("."));
  const key = itemKey.replace(head + ".", "");
  const value = itemValue.replace(/\\n/gi, "\n");
  if (typeof global.language[head] == "undefined")
    global.language[head] = new Object();
  global.language[head][key] = value;
}
global.getText = function (...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - not found key language : ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === "undefined") {
    throw new Error(`${__filename} - not found key text : ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, "g");
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
  if (!global.config.BOTNAME) {
    logger.error(
      `please enter your bot name in ${chalk.blueBright("Config.json")} file`
    );
    process.exit(0);
  }
  if (!global.config.PREFIX) {
    logger.error(
      `please enter your bot prefix in ${chalk.blueBright("Config.json")} file`
    );
  }
  if (global.config.author != "MrTomXxX") {
    logger.error(
      `detected : author was changed at ${chalk.blueBright("Config.json")}`
    );
    process.exit(0);
  }
  if (packages.author != "MrTomXxX") {
    logger.error(
      `detected : author was changed at ${chalk.blueBright("package.json")}`
    );
    process.exit(0);
  }
  if (packages.name != "free-bot") {
    logger.error(
      `detected : project name was changed at ${chalk.blueBright(
        "package.json"
      )}`
    );
    process.exit(0);
  }
} catch (error) {
  return;
}

try {
  var appStateFile = resolve(
    join(global.client.mainPath, "../../Cookies.json")
  );
  var appState =
    (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) &&
    fs.readFileSync(appStateFile, "utf8")[0] != "[" &&
    mtx.encryptSt
      ? JSON.parse(
          global.utils.decryptState(
            fs.readFileSync(appStateFile, "utf8"),
            process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER
          )
        )
      : require(appStateFile);
  logger.loader(`deployed ${chalk.blueBright("Cookies")} file`);
} catch (e) {
  return logger.error(`can't read ${chalk.blueBright("Cookies")} file`);
}

function onBot({ models: botModel }) {
  const loginData = {};
  loginData.appState = appState;
  login(loginData, async (loginError, loginApiData) => {
    if (loginError) {
      console.log(loginError);
      return process.exit(0);
    }
    loginApiData.setOptions(global.mtx.loginoptions);
    const fbstate = loginApiData.getAppState();
    let d = loginApiData.getAppState();
    d = JSON.stringify(d, null, "\x09");
    if (
      (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) &&
      global.mtx.encryptSt
    ) {
      d = await global.utils.encryptState(
        d,
        process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER
      );
      writeFileSync(appStateFile, d);
    } else {
      writeFileSync(appStateFile, d);
    }
    global.client.api = loginApiData;
    (global.mtx.version = config.version),
      (async () => {
        const commandsPath = `../../scripts/commands`;
        const listCommand = readdirSync(commandsPath).filter(
          (command) =>
            command.endsWith(".js") &&
            !command.includes("example") &&
            !global.config.disabledcmds.includes(command)
        );
        console.clear();
        console.log(chalk.blue(`DEPLOYING ALL COMMANDS\n`));
        for (const command of listCommand) {
          try {
            const module = require(`${commandsPath}/${command}`);
            const { config } = module;

            if (!config?.category) {
              try {
                throw new Error(
                  `command - ${command} category is not in the correct format or empty`
                );
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }

            if (!config?.hasOwnProperty("prefix")) {
              console.log(
                `command -`,
                chalk.hex("#ff0000")(command) +
                  ` does not have the "prefix" property.`
              );
              continue;
            }

            if (global.client.commands.has(config.name || "")) {
              console.log(
                chalk.red(
                  `command - ${chalk.hex("#FFFF00")(
                    command
                  )} module is already deployed.`
                )
              );
              continue;
            }
            const { dependencies, envConfig } = config;
            if (dependencies) {
              Object.entries(dependencies).forEach(
                ([reqDependency, dependencyVersion]) => {
                  if (listPackage[reqDependency]) return;
                  try {
                    execSync(
                      `npm install --save ${reqDependency}${
                        dependencyVersion ? `@${dependencyVersion}` : ""
                      }`,
                      {
                        stdio: "inherit",
                        env: process.env,
                        shell: true,
                        cwd: join("../../node_modules"),
                      }
                    );
                    require.cache = {};
                  } catch (error) {
                    const errorMessage = `failed to install package ${reqDependency}\n`;
                    global.loading.err(
                      chalk.hex("#ff7100")(errorMessage),
                      "command"
                    );
                  }
                }
              );
            }

            if (envConfig) {
              const moduleName = config.name;
              global.configModule[moduleName] =
                global.configModule[moduleName] || {};
              global.mtx[moduleName] = global.mtx[moduleName] || {};
              for (const envConfigKey in envConfig) {
                global.configModule[moduleName][envConfigKey] =
                  global.mtx[moduleName][envConfigKey] ??
                  envConfig[envConfigKey];
                global.mtx[moduleName][envConfigKey] =
                  global.mtx[moduleName][envConfigKey] ??
                  envConfig[envConfigKey];
              }
              var mtxPath = require("../configs/Config.json");
              mtxPath[moduleName] = envConfig;
              writeFileSync(
                global.client.mtxPath,
                JSON.stringify(mtxPath, null, 4),
                "utf-8"
              );
            }

            if (module.onLoad) {
              const moduleData = {};
              moduleData.api = loginApiData;
              moduleData.models = botModel;
              try {
                module.onLoad(moduleData);
              } catch (error) {
                const errorMessage =
                  "unable to load the onLoad function of the module.";
                throw new Error(errorMessage, "error");
              }
            }

            if (module.handleEvent)
              global.client.eventRegistered.push(config.name);
            global.client.commands.set(config.name, module);
            try {
              global.loading(
                `${crayon(``)}successfully deployed ${chalk.blueBright(
                  config.name
                )}`,
                "command"
              );
            } catch (err) {
              console.error(
                "an error occurred while deploying the command : ",
                err
              );
            }

            console.err;
          } catch (error) {
            global.loading.err(
              `${chalk.hex("#ff7100")(``)}failed to deploy ${chalk.hex(
                "#FFFF00"
              )(command)} ` +
                error +
                "\n",
              "command"
            );
          }
        }
      })(),
      (async () => {
        const events = readdirSync(
          join(global.client.mainPath, "../../scripts/events")
        ).filter(
          (ev) =>
            ev.endsWith(".js") && !global.config.disabledevents.includes(ev)
        );
        console.log(chalk.blue(`\n` + `DEPLOYING ALL EVENTS`));
        for (const ev of events) {
          try {
            const event = require(join(
              global.client.mainPath,
              "../../scripts/events",
              ev
            ));
            const { config, onLoad, run } = event;
            if (!config || !config.name || !run) {
              global.loading.err(
                `${chalk.hex("#ff7100")(``)} ${chalk.hex("#FFFF00")(
                  ev
                )} module is not in the correct format. `,
                "event"
              );
              continue;
            }

            if (errorMessages.length > 0) {
              console.log("commands with errors :");
              errorMessages.forEach(({ command, error }) => {
                console.log(`${command}: ${error}`);
              });
            }

            if (global.client.events.has(config.name)) {
              global.loading.err(
                `${chalk.hex("#ff7100")(``)} ${chalk.hex("#FFFF00")(
                  ev
                )} module is already deployed.`,
                "event"
              );
              continue;
            }
            if (config.dependencies) {
              const missingDeps = Object.keys(config.dependencies).filter(
                (dep) => !global.nodemodule[dep]
              );
              if (missingDeps.length) {
                const depsToInstall = missingDeps
                  .map(
                    (dep) =>
                      `${dep}${
                        config.dependencies[dep]
                          ? "@" + config.dependencies[dep]
                          : ""
                      }`
                  )
                  .join(" ");
                execSync(
                  `npm install --no-package-lock --no-save ${depsToInstall}`,
                  {
                    stdio: "inherit",
                    env: process.env,
                    shell: true,
                    cwd: join("../../node_modules"),
                  }
                );
                Object.keys(require.cache).forEach(
                  (key) => delete require.cache[key]
                );
              }
            }
            if (config.envConfig) {
              const configModule =
                global.configModule[config.name] ||
                (global.configModule[config.name] = {});
              const configData =
                global.mtx[config.name] || (global.mtx[config.name] = {});
              for (const evt in config.envConfig) {
                configModule[evt] = configData[evt] =
                  config.envConfig[evt] || "";
              }
              writeFileSync(
                global.client.mtxPath,
                JSON.stringify(
                  {
                    ...require(global.client.mtxPath),
                    [config.name]: config.envConfig,
                  },
                  null,
                  2
                )
              );
            }
            if (onLoad) {
              const eventData = {};
              (eventData.api = loginApiData), (eventData.models = botModel);
              await onLoad(eventData);
            }
            global.client.events.set(config.name, event);
            global.loading(
              `${crayon(``)}successfully deployed ${chalk.blueBright(
                config.name
              )}`,
              "event"
            );
          } catch (err) {
            global.loading.err(
              `${chalk.hex("#ff0000")("")}${chalk.blueBright(
                ev
              )} failed with error : ${err.message}` + `\n`,
              "event"
            );
          }
        }
      })();
    console.log(chalk.blue(`\n` + `DEPLOYING BOT DATA`));
    global.loading(
      `${crayon(``)}deployed ${chalk.blueBright(
        `${global.client.commands.size}`
      )} commands and ${chalk.blueBright(
        `${global.client.events.size}`
      )} events`,
      "data"
    );
    global.loading(
      `${crayon(``)}deployed time : ${chalk.blueBright(
        ((Date.now() - global.client.timeStart) / 1000).toFixed() + "s"
      )}`,
      "data"
    );
    const listenerData = {};
    listenerData.api = loginApiData;
    listenerData.models = botModel;
    const listener = require("../system/listen.js")(listenerData);
    global.custom = require("../../MTX.js")({ api: loginApiData });
    global.handleListen = loginApiData.listenMqtt(async (error, message) => {
      if (error) {
        logger.error(error);
        return process.exit(0);
      }
      if (
        ["presence", "typ", "read_receipt"].some(
          (data) => data === message.type
        )
      )
        return;
      return listener(message);
    });
  });
}
(async () => {
  try {
    await sequelize.authenticate();
    const authentication = {};
    const chalk = require("chalk");
    authentication.Sequelize = Sequelize;
    authentication.sequelize = sequelize;
    const models = require("../system/database/model.js")(authentication);
    logger(`deployed ${chalk.blueBright("database")} system`, "MrTomXxX");
    logger(`deploying ${chalk.blueBright("login")} system`, "MrTomXxX");
    const botData = {};
    botData.models = models;
    onBot(botData);
  } catch (error) {
    logger(`can't deploy ${chalk.blueBright("database")} system`, "MrTomXxX");
  }
})();
