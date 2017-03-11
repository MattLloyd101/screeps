const _ = require('./lodash.poly');
const Config = require('./config');

module.exports = (spawnStrategy) => {

  // TODO: This is stupid
  const TEST_CREEP = Config.unitTypes.harvester.basic.create().body;

  let spawnList;

  const init = (_spawnList) => {
    spawnList = _spawnList;
  };

  const spawnersThatCanSpawn = () => {
    return _.filter(spawnList, (spawner) => {
      const value = spawner.canCreateCreep(TEST_CREEP);
      return value === Config.errorCodes.OK;
    });
  };

	const canSpawnCount = () => {
    return spawnersThatCanSpawn().length;
  };

  const spawn = (unit) => {

    if (canSpawnCount() <= 0) return false;
    const spawner = _.first(spawnersThatCanSpawn());

    if (Config.INFO) console.log("Spawning Unit:", unit.role);
    if (Config.DEBUG) console.log("    ", unit.body);
    return spawner.createCreep(unit.body, undefined, {role: unit.role}) === Config.errorCodes.OK;
  };

	return {
    init: init,
    canSpawnCount: canSpawnCount,
    spawn: spawn
	};
};

