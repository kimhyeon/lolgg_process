const mongoose = require('mongoose');

var Static = new mongoose.Schema({
  type: String,
  data: Object,
  version: String
});

module.exports = mongoose.model('static', Static);