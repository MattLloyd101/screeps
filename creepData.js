const _ = require('./lodash.poly');
const Role = require('./role');
const Units = require('./config.units');

module.exports = (Game) => {

  let _creeps = undefined;
  let _harvesters = undefined;

  const clearCache = () => {
    _creeps = undefined;
    _harvesters = undefined;
  };

  const allCreeps = () => {
    if(_.isNil(_creeps)) {
      _creeps = _.values(Game.creeps);
    }

    return _creeps;
  };

  const harvesters = () => {
    if(_.isNil(_harvesters)) {
      _harvesters = _.filter(allCreeps(), Role.testMaster(Units.harvester.masterRole));
    }

    return _harvesters;
  };

  return {
    clearCache,

    allCreeps,
    harvesters
  };
};
