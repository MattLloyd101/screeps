const _ = require('./lodash.poly');
const Role = require('./role');
const Config = require('./config');
const ObjectTypes = Config.objectTypes;
const TerrainTypes = Config.terrainTypes;

module.exports = (messageBus, WorldData, CreepData) => {

  const recommendedHarvestersForSourceAt = (room, x, y) => {
    const tiles = room.lookAtAreaByTypes(y - 1, x - 1, y + 1, x + 1, [ObjectTypes.TERRAIN]);
    const workableTiles = _.filter(tiles, (tile) => {
      return tile.terrain === TerrainTypes.PLAIN;
    });
    // we add one for the travel back.
    // really the + 1 needs to be a function of distance and harvest time.
    return workableTiles.length + 1;
  };

  const harvestersForSource = (sourceId, currentHarvesters) => {
    return _.filter(currentHarvesters, (harvester) => {
      const state = Role.getState(harvester.memory.role);
      return state === "harvesting" && harvester.memory.target === sourceId;
    });
  };

  const enemiesNearSource = (room) => (source) => {
    const pos = source.pos;
    const hasEnemiesNearby = room.enemyCreepsInArea(pos.y - 5, pos.x - 5, pos.y + 5, pos.x + 5);

    if (hasEnemiesNearby) {
      if (Config.VERBOSE) console.log("[HarvesterStrategy] source(" + source.id + ") hasEnemiesNearby(" + hasEnemiesNearby + ")");
    }
    return hasEnemiesNearby;
  };

  const sourceNeedsHarvesters = (room, currentHarvesters) => (source) => {
    const pos = source.pos;
    const neededHarvesters = recommendedHarvestersForSourceAt(room, pos.x, pos.y);
    const numHarvestersForSource = harvestersForSource(source.id, currentHarvesters).length;

    if (Config.VERBOSE) console.log("[HarvesterStrategy] source(" + source.id + ") needed(" + neededHarvesters + ") current(" + numHarvestersForSource + ")");

    return numHarvestersForSource < neededHarvesters;
  };

  const findAvailableSourcesInRoom = (roomName) => {
    const room = WorldData.roomByName(roomName);
    const sources = room.energySources();
    const fn = enemiesNearSource(room);
    const sourcesWithoutEnemies = _.filter(sources, (source) => !fn(source));
    if(sourcesWithoutEnemies.length === 0) return [];

    const currentHarvesters = CreepData.harvesters();
    return _.filter(sourcesWithoutEnemies, sourceNeedsHarvesters(room, currentHarvesters));
  };

  const respondToHarvestTargetRequest = (message) => {
    const pos = message.pos;

    const availableSources = findAvailableSourcesInRoom(pos.roomName);

    // TODO: sort by distance from pos.
    if (availableSources.length > 0)
      message.callback(availableSources[0].id);
  };

  const handleMessage = (message) => {
    const type = message.type;
    switch (type) {
      case Config.messageTypes.HARVEST_TARGET_REQUEST:
        if (Config.VERBOSE) console.log("[HarvesterStrategy] handling message: ", JSON.stringify(message));
        respondToHarvestTargetRequest(message);
        break;
      default:
    }
  };

  const startListening = () => {
    messageBus.addListener(handleMessage);
  };

  return {
    handleMessage,
    startListening,

    recommendedHarvestersForSourceAt,

    findAvailableSourcesInRoom
  };
};

