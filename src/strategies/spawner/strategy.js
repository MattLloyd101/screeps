const __ = require('./../../lodash.poly');

const Harvester = require('./harvester');

module.exports = () => {

  const strategies = [];

  strategies.push(Harvester());

  return require('../../utils/strategyPattern')(strategies);
};