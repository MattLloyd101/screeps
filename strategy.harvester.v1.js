module.exports = (Config) => {

  var BodyTypes = Config.bodyTypes;
  var UnitTypes = Config.unitTypes;
  var RequestType = Config.requestTypes;

	var basicHarvester = UnitTypes.harvester.basic;

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

	return {
		spawnRequests: spawnRequests
	};
};
