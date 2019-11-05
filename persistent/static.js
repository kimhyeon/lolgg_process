const colors = require('colors');
const staticModel = require("../model/Static");

exports.findOne = (query) => {
  return new Promise((resolve, reject) => {

    staticModel.findOne(query, (err, static) => {
      if(err) {
        console.log(colors.red(err));
        reject(err);
      } else {
        resolve(static);
      }
    });

  });
}