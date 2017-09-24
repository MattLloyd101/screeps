const __ = require('./utils/lodash.poly.js');
const Role = require('./role');
const Units = require('./config/units.js');

module.exports = (Game) => {

  let _creeps = undefined;
  let _harvesters = undefined;

  const clearCache = () => {
    _creeps = undefined;
    _harvesters = undefined;
  };

  const allCreeps = () => {
    if(__.isNil(_creeps)) {
      _creeps = __.values(Game.creeps);
    }

    return _creeps;
  };

  const harvesters = () => {
    if(__.isNil(_harvesters)) {
      _harvesters = __.filter(allCreeps(), Role.testMaster(Units.harvester.masterRole));
    }

    return _harvesters;
  };

  const harvestersInRoom = (roomName) => {
    return __.filter(harvesters(), (harvester) => harvester.pos.roomName === roomName);
  };

  return {
    clearCache,

    allCreeps,

    harvesters,
    harvestersInRoom
  };
};
