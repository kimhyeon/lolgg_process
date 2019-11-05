const mongoose = require('mongoose');

var ProcessLog = new mongoose.Schema({
  type: String,
  message: String,
  koDate: String
});

module.exports = mongoose.model('process_log', ProcessLog);