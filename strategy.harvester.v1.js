module.exports = (Config, messageBus, WorldData) => {

  var UnitTypes = Config.unitTypes;
  var RequestType = Config.requestTypes;

	var basicHarvester = UnitTypes.harvester.basic;

  // Message Handling
  var respondToHarvestTargetRequest = (message) => {
    var pos = message.pos;
    var sources = WorldData.filteredRoomDataByType(pos.roomName, Config.objectTypes.SOURCE);
    message.callback(sources[0].source.id);
  };

  var handleMessage = (message) => {
    var type = message.type;
    switch (type) {
      case Config.messageTypes.HARVEST_TARGET_REQUEST:
        if(Config.VERBOSE) console.log("[HarvesterStrategy] handling message: ", JSON.stringify(message));
        respondToHarvestTargetRequest(message);
      break;
      default:
    }
  };

  // Logic
	var createSpawnRequest = (unitShape) => {
		return {
      type: RequestType.SPAWN,
      unit: basicHarvester.create(),
      priority: 100
    };
	};

	var spawnRequests = () => {
		return [ createSpawnRequest(basicHarvester) ];
	};

  messageBus.addListener(handleMessage);

	return {
    respondToHarvestTargetRequest: respondToHarvestTargetRequest,

		spawnRequests: spawnRequests
	};
};
