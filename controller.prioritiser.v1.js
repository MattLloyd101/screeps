var _ = require('./lodash.poly');

module.exports = (strategies, spawnController) => {

  var collateSpawns = () => {
    var collatedSpawns = _.flatMap(strategies, (strategy) => strategy.spawnRequests());
    var sortedSpawns = _.sortBy(collatedSpawns, "priority").reverse();
    return _.map(sortedSpawns, (request) => request.unit);
  };

  var performSpawns = () => {
    var spawnCount = spawnController.canSpawnCount()
    if(spawnCount !== 0) {
      var spawns = _.take(collateSpawns(), spawnCount);
      _.each(spawns, spawnController.spawn);
    }
  };

  return {
    collateSpawns: collateSpawns,
    performSpawns: performSpawns
  };
};
