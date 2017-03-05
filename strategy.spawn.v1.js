var _ = require('./lodash.poly');

module.exports = (Config, messageBus, WorldData) => {

  var RequestType = Config.requestTypes;

  // Energy Strategy
  var createEnergyRequest = (spawn) => {

    var room = spawn.room;
    return [{
      type: RequestType.ENERGY,
      target: spawn.id,
      energy: room.energyCapacityAvailable - room.energyAvailable,
      priority: 1
    }];
  };

  var energyRequests = () => {
    var rooms = WorldData.rooms();
    var allSpawns = _.flatMap(rooms, (room) => {
      return WorldData.filteredStructureByType(room.name, Config.structureTypes.SPAWN);
    });

    return _.flatMap(allSpawns, createEnergyRequest);
  };

  var requestEnergy = (spawner, cost, priority) => {
    _energyRequests
  };

  return {
    requestEnergy: requestEnergy,
    energyRequests: energyRequests
  };
};
