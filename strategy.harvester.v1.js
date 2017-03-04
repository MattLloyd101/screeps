var Config = require("./config.js")();
var BodyTypes = Config.bodyTypes;
var RequestType = Config.requestTypes;

module.exports = () => {
	var init = () => {

	};

	var basicHarvester = {
    body: [
      BodyTypes.WORK.val,
      BodyTypes.CARRY.val,
      BodyTypes.MOVE.val
    ]
  };

	var createSpawnRequest  = (unitShape) => {
		return { type: RequestType.SPAWN, unit: basicHarvester };
	}
	var spawnRequests = () => {
		return [ createSpawnRequest(basicHarvester) ];
	};

	return {
		init: init,
		spawnRequests: spawnRequests
	};
};
