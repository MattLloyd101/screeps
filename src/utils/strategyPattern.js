const __ = require('./lodash.poly.js');

module.exports = (strategies) => {
  const getFacts = (strategies) => __.flatMap(strategies, (strategy) => strategy.getFacts());
  const getRules = (strategies) => __.flatMap(strategies, (strategy) => strategy.getRules());

  return {
    getFacts: () => getFacts(strategies),
    getRules: () => getRules(strategies)
  };
};