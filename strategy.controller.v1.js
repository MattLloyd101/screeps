var _ = require('./lodash.poly');

module.exports = (Config, messageBus, WorldData) => {

  var RequestType = Config.requestTypes;

  // Energy Strategy
  var createEnergyRequest = (controller) => {

    var room = controller.room;
    console.log(JSON.stringify(room));
    return [{
      type: RequestType.ENERGY,
      target: controller.id,
      energy: room.energyCapacityAvailable - room.energyAvailable,
      priority: 1
    }];
  };

  var energyRequests = () => {
    var rooms = WorldData.rooms();
    var allSpawns = _.flatMap(rooms, (room) => {
      return WorldData.filteredStructureByType(room.name, Config.structureTypes.CONTROLLER);
    });

    return _.flatMap(allSpawns, createEnergyRequest);
  };

  return {
    energyRequests: energyRequests
  };
};
