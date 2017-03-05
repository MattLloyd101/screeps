var _ = require('./lodash.poly');
var Config = require('./config');
var BodyTypes = Config.bodyTypes;

module.exports = (spawnStrategy) => {

  var TEST_CREEP = Config.unitTypes.harvester.basic.create().body;

  var spawnList;

  var init = (_spawnList) => {
    spawnList = _spawnList;
  };

  var spawnersThatCanSpawn = () => {
    return _.filter(spawnList, (spawner) => {
      var value = spawner.canCreateCreep(TEST_CREEP);
      return value === Config.errorCodes.OK;
    });
  };

	var canSpawnCount = () => {
    return spawnersThatCanSpawn().length;
  };

  var spawn = (unit) => {

    if(canSpawnCount() <= 0) return false;
    var spawner = _.first(spawnersThatCanSpawn());

    spawnStrategy.requestEnergy(spawner.id, unit.cost);

    if(Config.INFO) console.log("Spawning Unit:", unit.role);
    if(Config.DEBUG) console.log("    ", unit.body);
    return spawner.createCreep(unit.body, undefined, { role: unit.role }) === Config.errorCodes.OK;
  };

	return {
    init: init,
    canSpawnCount: canSpawnCount,
    spawn: spawn
	};
}

