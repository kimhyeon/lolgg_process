const colors = require('colors');
const schedule = require('node-schedule');
const request = require('request');
const mongoose = require('mongoose');

const staticService = require('../service/static')
const dbLogger = require('../persistent/processLog');

mongoose.connect('mongodb://rasgo.iptime.org:27017/lolgg')
  .then(() => {
    console.log(colors.green("connected mongodb succesful."));

    startVersionChecker();

  })
  .catch((err) => console.error(err));

let apiRequest = null; 
  getCurrentRiotVersion = null,
  startVersionChecker = null;

startVersionChecker = () => {
  console.log(console.log(colors.green("start version-checker")));

  let rule = new schedule.RecurrenceRule();
  rule.hour = 1;
  let versionCheck = schedule.scheduleJob(rule, () => {
  // let versionCheck = schedule.scheduleJob("10 * * * * *", () => {
    (async () => {
      let riotVersion = await getCurrentRiotVersion(),
        lolggVersion = await staticService.getVersion();

      lolggVersion = lolggVersion.data;

      console.log(`riotVersion : ${riotVersion}`, `lolggVersion : ${lolggVersion}`);
      dbLogger.saveLog("riot", `riotVersion : ${riotVersion}, lolggVersion : ${lolggVersion}`);
    })();

  });

}

apiRequest = (sendURL) => {
  console.log(colors.bgMagenta("REQUEST"), colors.cyan(`${sendURL}`));

  return new Promise((resolve, reject) => {
    request({ 
      uri: sendURL, 
      method: "GET", 
      timeout: 10000, 
      followRedirect: true, 
      maxRedirects: 10 
    }, (error, response, body) => { 

      if(response.statusCode === 200 || response.statusCode === 304) {
        console.log(colors.green("OK"));
        resolve(JSON.parse(body));
      } else {
        console.log(colors.red(JSON.parse(body)));
        reject({statusCode: response.statusCode});
      }

      if(error) {
        console.log(colors.bgRed(`API ${response.statusCode} ERROR`));
        reject({statusCode: response.statusCode, error: error});
      }

    });

  });

};

getCurrentRiotVersion = () => {
  const URL = "https://ddragon.leagueoflegends.com/api/versions.json";
  return new Promise((resolve, reject) => {
    apiRequest(URL)
    .then((versions) => {
      let currentVersion = versions[0]; 
      console.log(colors.green(`riot current version ${currentVersion}`));
      resolve(currentVersion);
    })
    .catch((err) => {
      console.log(colors.red(`riot get versions.json FAIL!!`));
      dbLogger.saveLog("riot", `riot get versions.json FAIL!!`);
      setTimeout(() => {
        console.log(colors.magenta("riot get versions.json RETRY!!"));
        getCurrentRiotVersion();
      }, 5000);
    });
  });
}