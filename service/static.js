const colors = require('colors');
const staticDAO = require('../persistent/static');

exports.getVersion = () => {
  return staticDAO.findOne({type: "version"});
  // return new Promise((resolve, reject) => {
  //   (async() => {
  //     try {
  //       let lolggVersion = await staticDAO.findOne({type: "version"});
  //       resolve(lolggVersion);
  //     } catch(err) {
  //       console.log(colors.red(err));
  //       reject(err);
  //     }
  //   });
  // });
}