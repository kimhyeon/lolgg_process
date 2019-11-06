const colors = require('colors');
const dbLogger = require('../persistent/processLog');
const request = require('request');

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

      console.log(colors.cyan(response.statusCode));

      if(response.statusCode === 200 || response.statusCode === 304) {
        console.log(colors.green("OK"));
        resolve(JSON.parse(body));
      } else {
        try {
          console.log(colors.red(JSON.parse(body)));
        } catch(err) {
          console.log(colors.red("BODY -> JSON PARSE ERROR!!"));
        }
        reject({statusCode: response.statusCode});
      }

      if(error) {
        console.log(colors.bgRed(`API ${response.statusCode} ERROR`));
        reject({statusCode: response.statusCode, error: error});
      }

    });

  });

};

let getRiotVersion = () => {
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
      dbLogger.saveLog("riot", `riot get versions.json ${err.statusCode} FAIL!!, RETRY!! after 5 seconds`);
      setTimeout(() => {
        console.log(colors.magenta("riot get versions.json RETRY!!"));
        getRiotVersion();
      }, 5000);
    });

  });

}
exports.getRiotVersion = getRiotVersion;

exports.getChampions = (riotVersion) => {
  const URL = `http://ddragon.leagueoflegends.com/cdn/${riotVersion}/data/ko_KR/champion.json`;

  return new Promise((resolve, reject) => {
    apiRequest(URL)
    .then((champion) => {
      resolve(champion);
    })
    .catch((err) => {
      reject(err);
    });
  });

}

exports.getSummoner = (riotVersion) => {
  const URL = `http://ddragon.leagueoflegends.com/cdn/${riotVersion}/data/ko_KR/summoner.json`;
  
  return new Promise((resolve, reject) => {
    apiRequest(URL)
    .then((summoner) => {
      resolve(summoner);
    })
    .catch((err) => {
      reject(err);
    });
  });

}