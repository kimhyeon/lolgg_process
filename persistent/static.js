const colors = require('colors');
const staticModel = require("../model/Static");

exports.findOne = (query) => {
  return staticModel.findOne(query);
}

exports.save = (type, version, data) => {
  let static = new staticModel({
    type: type,
    version: version,
    data: data
  });
  return static.save();
}

exports.updateOne = (type, static) => {
  return staticModel.updateOne({type: type}, static);
}