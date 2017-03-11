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

  return {
    collateEnergyRequests: collateEnergyRequests
  };
};
