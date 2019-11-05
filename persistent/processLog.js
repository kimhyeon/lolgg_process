const colors = require('colors');
const moment = require('moment');
const processLogModel = require("../model/ProcessLog");

require('moment-timezone');

exports.saveLog = (type, message) => {
  let koDate = moment().format("YYYY-MM-DD HH:mm:ss");
  
  let log = new processLogModel({
    type: type,
    message: message,
    koDate: koDate
  });

  log.save((err, saved_log) => {
    if(err) {
      console.log(colors.red("log save error."));
    } else {
      console.log(colors.green("log save OK."), saved_log);
    }
  });

}