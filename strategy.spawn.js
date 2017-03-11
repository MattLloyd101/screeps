const _ = require('./lodash.poly');

module.exports = (Config, messageBus, WorldData) => {

  const RequestType = Config.requestTypes;

  // Energy Strategy
  const createEnergyRequest = (spawn) => {

    const room = spawn.room;
    return [{
      type: RequestType.ENERGY,
      target: spawn.id,
      energy: room.energyCapacityAvailable - room.energyAvailable,
      priority: 1
    }];
  };

  const energyRequests = () => {
    const rooms = WorldData.rooms();
    const allSpawns = _.flatMap(rooms, (room) => {
      return WorldData.filteredStructureByType(room.name, Config.structureTypes.SPAWN);
    });

    return _.flatMap(allSpawns, createEnergyRequest);
  };

  const requestEnergy = (spawner, cost, priority) => {
    _energyRequests
  };

  return {
    requestEnergy: requestEnergy,
    energyRequests: energyRequests
  };
};
