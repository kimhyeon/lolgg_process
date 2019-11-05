const colors = require('colors');
const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');

mongoose.connect('mongodb://rasgo.iptime.org:27017/lolgg')
  .then(() => console.log("connected mongodb succesful."))
  .catch((err) => console.error(err));

moment.tz("Asia/Seoul");

let a = setInterval(() => {
	console.log(colors.green("WILL SEND"), colors.yellow(new Date()), colors.cyan(moment().tz("Asia/Seoul").format()));
}, 1000);