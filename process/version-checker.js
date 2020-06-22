const colors = require('colors');
const schedule = require('node-schedule');
const mongoose = require('mongoose');

const staticService = require('../service/static');
const riotService = require('../service/riot');

mongoose
  .connect('mongodb://rasgo.iptime.org:27017/lolgg')
  .then(() => {
    console.log(colors.green('connected mongodb succesful.'));

    startVersionChecker();
  })
  .catch(err => console.error(err));

let apiRequest = null;
(getCurrentRiotVersion = null), (startVersionChecker = null);

startVersionChecker = () => {
  console.log(console.log(colors.green('start version-checker')));

  // let versionCheck = schedule.scheduleJob("*/5 * * * * *", () => {
  // do it every hour
  let versionCheck = schedule.scheduleJob('0 0 * * * *', () => {
    (async () => {
      let riotVersion = await riotService.getRiotVersion();

      staticService.checkVersion(riotVersion);
      staticService.checkChampion(riotVersion);
      staticService.checkSummoner(riotVersion);
    })();
  });
};
