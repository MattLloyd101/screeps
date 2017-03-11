const _ = require('./lodash.poly');

module.exports = (Config, messageBus, WorldData) => {

  const RequestType = Config.requestTypes;

  // Energy Strategy
  const createEnergyRequest = (controller) => {

    const room = controller.room;
    console.log(JSON.stringify(room));
    return [{
      type: RequestType.ENERGY,
      target: controller.id,
      energy: room.energyCapacityAvailable - room.energyAvailable,
      priority: 1
    }];
  };

  const energyRequests = () => {
    const rooms = WorldData.rooms();
    const allSpawns = _.flatMap(rooms, (room) => {
      return WorldData.filteredStructureByType(room.name, Config.structureTypes.CONTROLLER);
    });

    return _.flatMap(allSpawns, createEnergyRequest);
  };

  return {
    energyRequests: energyRequests
  };
};
