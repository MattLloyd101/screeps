const _ = require('./lodash.poly');
const Config = require('./config');

module.exports = (strategies, spawnController, messageBus) => {

  // Energy Requests
  // TODO: I was bad and didn't TDD this bit. Add some tests.
  const energyStrategies = _.filter(strategies, (strategy) => 'energyRequests' in strategy);

  const collateEnergyRequests = () => {
    const collatedRequests = _.flatMap(energyStrategies, (strategy) => {
      return strategy.energyRequests();
    });

    console.log(JSON.stringify(collatedRequests));
    const sortedRequests = _.sortBy(collatedRequests, (request) => request.priority * request.energy).reverse();
    return _.map(sortedRequests, (request) => request.target);
  };

  let energyRequests = undefined;
  const handleEnergyRequests = (message) => {
    if (_.isNil(energyRequests)) energyRequests = collateEnergyRequests();

    const request = energyRequests[0];
    message.callback(request);
  };

  messageBus.addListener(handleEnergyRequests, Config.messageTypes.ENERGY_DELIVERY_TARGET_REQUEST);

  // Spawning
  const spawningStrategies = _.filter(strategies, (strategy) => 'spawnRequests' in strategy);

  const collateSpawnRequests = () => {
    const collatedSpawns = _.flatMap(spawningStrategies, (strategy) => strategy.spawnRequests());
    const sortedSpawns = _.sortBy(collatedSpawns, "priority").reverse();
    return _.map(sortedSpawns, (request) => request.unit);
  };

  const performSpawns = () => {
    const spawnCount = spawnController.canSpawnCount();
    if (spawnCount !== 0) {
      const spawns = _.take(collateSpawnRequests(), spawnCount);
      _.each(spawns, spawnController.spawn);
    }
  };

  return {
    collateEnergyRequests: collateEnergyRequests,

    collateSpawnRequests: collateSpawnRequests,
    performSpawns: performSpawns
  };
};
