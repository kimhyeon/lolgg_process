const colors = require('colors');
const riotService = require('../service/riot')
const staticDAO = require('../persistent/static');
const dbLogger = require('../persistent/processLog');

exports.checkChampion = (riotVersion) => {

  let getChampionsObj = null;

  (async () => {
    try {
      let lolggChampion = await staticDAO.findOne({type: "champion"}),
        lolggVersion = (lolggChampion !== null) ? lolggChampion.version : null;

      console.log(colors.cyan(`riotVersion : ${riotVersion}`), colors.yellow(`lolggVersion : ${lolggVersion}`));

      if(lolggChampion) {
        if(lolggVersion !== riotVersion) {
          let riotChampion = await riotService.getChampions(riotVersion),
            champion = getChampionsObj(riotChampion);

          staticDAO.updateOne("champion", {version: riotVersion, data:champion})
          .then((res) => {
            console.log(colors.green(`riotChampion update ${lolggVersion} -> ${riotVersion}`), res.n, res.nModified);
            dbLogger.saveLog("riot", `riotChampion update : ${lolggVersion} -> ${riotVersion}`);
          });;

        } else {
          dbLogger.saveLog("riot", `riotChampion ok`);
        }
      } else {
        let riotChampion = await riotService.getChampions(riotVersion),
          champion = getChampionsObj(riotChampion);

        staticDAO.save("champion", riotVersion, champion)
        .then((static) => {
          console.log(colors.green(`riotChampion save : ${static.version}`));
          dbLogger.saveLog("riot", `riotChampion save : ${static.version}`);
        });

      }

    } catch(err) {
      console.log(colors.red(err));
    }

  })();

  getChampionsObj = (riotChampions) => {
  
    let champions = riotChampions.data,
    keys = Object.keys(champions),
    newChampions = {};
  
    for(let i in keys) {
      let temp = champions[keys[i]];
  
      let newChampion = {
        id: temp.id,
        name: temp.name,
      }
      newChampions[temp.key] = newChampion;
    }
  
    return newChampions;
  
  }

}

exports.checkSummoner = (riotVersion) => {

  let getSummonerObj = null;

  (async () => {
    try {
      let lolggSummoner = await staticDAO.findOne({type: "summoner"}),
        lolggVersion = (lolggSummoner !== null) ? lolggSummoner.version : null;

      console.log(colors.cyan(`riotVersion : ${riotVersion}`), colors.yellow(`lolggVersion : ${lolggVersion}`));

      if(lolggSummoner) {
        if(lolggVersion !== riotVersion) {
          let riotSummoner = await riotService.getSummoner(riotVersion),
            summoner = getSummonerObj(riotSummoner);

          staticDAO.updateOne("summoner", {version: riotVersion, data:summoner})
          .then((res) => {
            console.log(colors.green(`riotSummoner update ${lolggVersion} -> ${riotVersion}`), res.n, res.nModified);
            dbLogger.saveLog("riot", `riotSummoner update : ${lolggVersion} -> ${riotVersion}`);
          });;

        } else {
          dbLogger.saveLog("riot", `riotSummoner ok`);
        }
      } else {
        let riotSummoner = await riotService.getSummoner(riotVersion),
          summoner = getSummonerObj(riotSummoner);

        staticDAO.save("summoner", riotVersion, summoner)
        .then((static) => {
          console.log(colors.green(`riotSummoner save : ${static.version}`));
          dbLogger.saveLog("riot", `riotSummoner save : ${static.version}`);
        });

      }

    } catch(err) {
      console.log(colors.red(err));
    }

  })();

  getSummonerObj = (riotSummoners) => {
  
    let summoners = riotSummoners.data,
      keys = Object.keys(summoners),
      newSummoners = {};

    for(let i in keys) {
      let temp = summoners[keys[i]];

      let newSummoner = {
        id: temp.id,
        name: temp.name,
        tooltip: temp.tooltip
      }
      newSummoners[temp.key] = newSummoner;
    }

    return newSummoners;
  
  }

}

