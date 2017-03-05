var _ = require('./lodash.poly');
var Config = require('./config');

module.exports = (strategies, spawnController, messageBus) => {

  // Energy Requests
  // TODO: I was bad and didn't TDD this bit. Add some tests.
  var energyStrategies = _.filter(strategies, (strategy) => 'energyRequests' in strategy);

  var collateEnergyRequests = () => {
    var collatedRequests = _.flatMap(energyStrategies, (strategy) => {
      return strategy.energyRequests();
    });

    console.log(JSON.stringify(collatedRequests));
    var sortedRequests = _.sortBy(collatedRequests, (request) => request.priority * request.energy).reverse();
    return _.map(sortedRequests, (request) => request.target);
  };

  var energyRequests = undefined;
  var handleEnergyRequests = (message) => {
    if(_.isNil(energyRequests)) energyRequests = collateEnergyRequests();

    var request = energyRequests[0];
    message.callback(request);
  };

  messageBus.addListener(handleEnergyRequests, Config.messageTypes.ENERGY_DELIVERY_TARGET_REQUEST);

  // Spawning
  var spawningStrategies = _.filter(strategies, (strategy) => 'spawnRequests' in strategy);

  var collateSpawnRequests = () => {
    var collatedSpawns = _.flatMap(spawningStrategies, (strategy) => strategy.spawnRequests());
    var sortedSpawns = _.sortBy(collatedSpawns, "priority").reverse();
    return _.map(sortedSpawns, (request) => request.unit);
  };

  var performSpawns = () => {
    var spawnCount = spawnController.canSpawnCount()
    if(spawnCount !== 0) {
      var spawns = _.take(collateSpawnRequests(), spawnCount);
      _.each(spawns, spawnController.spawn);
    }
  };

  return {
    collateEnergyRequests: collateEnergyRequests,

    collateSpawnRequests: collateSpawnRequests,
    performSpawns: performSpawns
  };
};
