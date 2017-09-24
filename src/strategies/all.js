const __ = require('./../utils/lodash.poly.js');

const RoomStrategy = require('./room/strategy');
const SpawnerStrategy = require('./spawner/strategy');

module.exports = (room) => {

  const strategies = [];

  strategies.push(RoomStrategy(room));
  strategies.push(SpawnerStrategy());

  return require('../utils/strategyPattern')(strategies);
};