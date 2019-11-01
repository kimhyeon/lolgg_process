const colors = require('colors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://rasgo.iptime.org:27017/lolgg')
  .then(() => console.log("connected mongodb succesful."))
  .catch((err) => console.error(err));

let a = setInterval(() => {
	console.log(colors.green("WILL SEND"), colors.yellow(new Date()));
}, 2000);