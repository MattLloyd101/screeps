const __ = require('../../lodash.poly.js');
const Rules = require('../../rules/rules');
const Units = require('../../config/units');

module.exports = (room) => {

  const getFacts = () => {
    return [];
  };

  const canSpawn = (body) => {
    return __.any(room.structures.spawns(), (spawn) => spawn.canCreateCreep(body));
  };

  const shouldSpawn = Rules.rule((fact) => {
      return fact.type == "spawn" &&
        fact.room.name() == room.name() &&
        !__.isNil(fact.body) &&
        __.isNil(fact.canSpawn);
    }
  )((R, fact) => {
    console.log("shouldSpawn");
    fact.canSpawn = canSpawn(fact.body);
    R.restart();
  });

  const getRules = () => [
    shouldSpawn
  ];

  return {
    getFacts,
    getRules
  };
};