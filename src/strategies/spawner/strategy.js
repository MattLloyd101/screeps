const __ = require('./../../utils/lodash.poly.js');

const Harvester = require('./harvester');

module.exports = () => {

  const strategies = [];

  strategies.push(Harvester());

  return require('../../utils/strategyPattern')(strategies);
};