const _ = require('./lodash.poly');

module.exports = (Config, messageBus, WorldData) => {

  const UnitTypes = Config.unitTypes;
  const RequestType = Config.requestTypes;

	const basicHarvester = UnitTypes.harvester.basic;

  // Source Strategy

  const sourcesInRoom = (roomName) => {
    return _.map(WorldData.filteredRoomDataByType(roomName, Config.objectTypes.SOURCE), (entry) => entry.source);
  };


  // Spawn Strategy
	const createSpawnRequest = (unitShape, priority) => {
    return {
      type: RequestType.SPAWN,
      unit: basicHarvester.create(),
      cost: basicHarvester.buildCost(),
      roomName: "",
      priority: priority
    };
  };

	const spawnRequests = () => {
    const requiredHarvesters = _.sum(WorldData.rooms(), (room) => {
      const sources = sourcesInRoom(room.name);
      return _.sum(sources, (source) => recommendedHarvesters(source.pos.roomName, source));
    });

    const current = harvesters().length;
    const neededHarvesters = requiredHarvesters - current;

    if (Config.DEBUG && neededHarvesters > 0) console.log("[HarvesterStrategy] needs " + neededHarvesters + " more harvesters");
    const out = [];
    for (let i = 0; i < neededHarvesters; i++) {
      out[i] = createSpawnRequest(basicHarvester, i);
    }
    return out;
  };

	return {
		spawnRequests
	};
};
