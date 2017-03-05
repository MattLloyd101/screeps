var _ = require('./lodash.poly');
var Config = require('./config');
var BodyTypes = Config.bodyTypes;

module.exports = () => {

  var TEST_CREEP = Config.unitTypes.harvester.basic.create().body;

  var spawnList;

  var init = (_spawnList) => {
    spawnList = _spawnList;
  };

  var spawnersThatCanSpawn = () => {
    return _.filter(spawnList, (spawner) => {
      var value = spawner.canCreateCreep(TEST_CREEP);
      return value === 0;
    });
  };

	var canSpawnCount = () => {
    return spawnersThatCanSpawn().length;
  };

  var spawn = (unit) => {

    if(canSpawnCount() <= 0) return false;
    var spawner = _.first(spawnersThatCanSpawn());

    if(Config.INFO) console.log("Spawning Unit:", unit.role);
    if(Config.DEBUG) console.log("    ", unit.body);
    return spawner.createCreep(unit.body, undefined, { role: unit.role }) === 0;
  };

	return {
    init: init,
    canSpawnCount: canSpawnCount,
    spawn: spawn
	};
}

