const __ = require('./../../utils/lodash.poly.js');

const HarvesterSpawningStrategy = require('./harvesterSpawn');
const SpawnerStrategy = require('./spawner');

module.exports = (room) => {

  const strategies = [];

  strategies.push(HarvesterSpawningStrategy(room));
  strategies.push(SpawnerStrategy(room));

  return require('../../utils/strategyPattern')(strategies);
};