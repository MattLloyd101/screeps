const __ = require('../../utils/lodash.poly.js');
const Rules = require('../../rules/rules');
const Units = require('../../config/units');

module.exports = () => {

  const getFacts = () => {
    return [];
  };

  const decidedUnit = () => Units.harvester;

  const decideHarvester = Rules.rule((fact) => {
    return fact.type == "spawn" &&
      fact.unitType == "harvester" &&
      __.isNil(fact.body);
  }
  )((R, fact) => {
    const unit = decidedUnit();
    fact.body = unit.body;
    fact.memory = unit.initialMemory;

    R.restart();
  });

  const getRules = () => [
    decideHarvester
  ];

  return {
    getFacts,
    getRules
  };
};