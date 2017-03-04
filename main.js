var _ = require("lodash");
var Config = require('./config')();
var PrioritiserFactory = require('./controller.prioritiser.v1');
var SpawnControllerFactory = require('./controller.spawn.v1');
var HarvesterStrategyFactory = require('./strategy.harvester.v1');

var harvesterStrategy = HarvesterStrategyFactory(Config);
var spawnController = SpawnControllerFactory();
var strategies = [harvesterStrategy];
var prioritiser = PrioritiserFactory(strategies, spawnController);


module.exports.loop = function () {
  var spawns = _.values(Game.spawns);
  spawnController.init(spawns);
  prioritiser.performSpawns();

  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if(creep.memory.role == 'harvester.basic') {
        roleHarvester.run(creep);
    }
  }
};
