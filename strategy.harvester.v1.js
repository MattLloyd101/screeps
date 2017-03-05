var _ = require('./lodash.poly');
var Role = require('./role');

module.exports = (Config, messageBus, WorldData) => {

  var UnitTypes = Config.unitTypes;
  var RequestType = Config.requestTypes;

	var basicHarvester = UnitTypes.harvester.basic;

  // Source Strategy
  var recommendedHarvesters = (roomName, source) => {
    var pos = source.pos;
    var tiles = WorldData.lookAtArea(roomName, pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1);
    var workableTiles = _.filter(tiles, (tile) => {
      return tile.type === Config.objectTypes.TERRAIN &&
        tile.terrain === Config.terrainTypes.PLAIN;
    });
    // we add one for the travel back.
    // really the + 1 needs to be a function of distance and harvest time.
    return workableTiles.length + 1;
  };

  var harvesters = () => {
    return _.filter(WorldData.allCreeps(), (creep) => {
      if(_.isNil(creep.memory)) return false;
      var role = Role.decomposeRole(creep.memory.role);
      return role.master === 'harvester';
    });
  };

  var sourcesInRoom = (roomName) => {
    return _.map(WorldData.filteredRoomDataByType(roomName, Config.objectTypes.SOURCE), (entry) => entry.source);
  };

  var respondToHarvestTargetRequest = (message) => {
    var pos = message.pos;
    var sources = sourcesInRoom(pos.roomName);

    var availableSources = _.filter(sources, (source) => {
      var sourcePos = source.pos;
      var hasEnemiesNearby = WorldData.enemiesInArea(sourcePos.roomName, sourcePos.y - 5, sourcePos.x - 5, sourcePos.y + 5, sourcePos.x + 5);
      if(hasEnemiesNearby) {
        if(Config.VERBOSE) console.log("[HarvesterStrategy] source("+ source.id + ") hasEnemiesNearby(" + hasEnemiesNearby + ")");
        return false;
      }

      var neededHarvesters = recommendedHarvesters(sourcePos.roomName, source);
      var currentHarvesters = harvesters();
      var numHarvestersForSource = _.filter(currentHarvesters, (harvester) => {
        var role = Role.decomposeRole(harvester.memory.role);
        return role.state === "harvesting" && harvester.memory.target === source.id;
      }).length


      if(Config.VERBOSE) console.log("[HarvesterStrategy] source("+ source.id + ") needed(" + neededHarvesters + ") current("+numHarvestersForSource+")");
      return numHarvestersForSource < neededHarvesters && !hasEnemiesNearby;
    });

    // TODO: sort by distance from pos.
    if (availableSources.length > 0)
      message.callback(availableSources[0].id);
  };

  // Message Handling
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

  // Spawn Strategy
	var createSpawnRequest = (unitShape, priority) => {
		return {
      type: RequestType.SPAWN,
      unit: basicHarvester.create(),
      cost: basicHarvester.buildCost(),
      roomName: "",
      priority: priority
    };
	};

	var spawnRequests = () => {
    var requiredHarvesters = _.sum(WorldData.rooms(), (room) => {
      var sources = sourcesInRoom(room.name)
      return _.sum(sources, (source) => recommendedHarvesters(source.pos.roomName, source));
    });

    var current = harvesters().length;
    var neededHarvesters = requiredHarvesters - current;

    if(Config.DEBUG && neededHarvesters > 0) console.log("[HarvesterStrategy] needs " + neededHarvesters + " more harvesters");
    var out = [];
    for (var i = 0; i < neededHarvesters; i++) {
      out[i] = createSpawnRequest(basicHarvester, i);
    }
    return out;
	};

  messageBus.addListener(handleMessage);

	return {
    respondToHarvestTargetRequest: respondToHarvestTargetRequest,

		spawnRequests: spawnRequests
	};
};
