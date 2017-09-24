const __ = require('./../../lodash.poly');

const HarvesterSpawningStrategy = require('./harvesterSpawn');
const SpawnerStrategy = require('./spawner');

module.exports = (room) => {

  const strategies = [];

  strategies.push(HarvesterSpawningStrategy(room));
  strategies.push(SpawnerStrategy(room));

  return require('../../utils/strategyPattern')(strategies);
};