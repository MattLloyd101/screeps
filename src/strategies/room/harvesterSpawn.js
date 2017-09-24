const __ = require('./../../utils/lodash.poly.js');
const Rules = require('./../../rules/rules');
const CreepPredicates = require('./../../creeps/creepPredicates');

module.exports = (room) => {

  const recommendedHarvesterCount = () => {
    return __.sum(_.map(room.energySources(), (source) => source.numberOfWorkableTiles()));
  };

  const currHarvesterCount = () => {
    return __.filter(room.creeps.all(), CreepPredicates.harvester).length;
  };

  const getFacts = () => {
    return [
      {
        recommendedHarvesterCount: recommendedHarvesterCount(),
        harvesterCount: currHarvesterCount()
      }
    ];
  };

  const spawnHarvester = Rules.rule (
    (fact) => fact.harvesterCount < fact.recommendedHarvesterCount
  )((R, fact) => {
    const newFact = {
      type: "spawn",

      room: room,
      unitType: "harvester"
    };
    Rules.dyanmicFact(newFact, fact);

    R.stop();
  });

  const getRules = () => [
    spawnHarvester
  ];

  return {
    getFacts,
    getRules
  };
};