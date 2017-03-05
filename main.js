var _ = require('./lodash.poly');
var Config = require('./config');

var rootMessageBus = require('./messageBus')();

var WorldData = require('./worldData')(Game);

// Controllers
var PrioritiserFactory = require('./controller.prioritiser.v1');
var RoleControllerFactory = require('./controller.role.v1');
var SpawnControllerFactory = require('./controller.spawn.v1');

// Strategies
var HarvesterStrategyFactory = require('./strategy.harvester.v1');

// Roles
var BasicHarvesterRoleFactory = require('./role.harvester.basic');

// Role instantiation
var basicHarvesterRole = BasicHarvesterRoleFactory(Game, rootMessageBus);
var roleDefinitions = { "harvester.basic": basicHarvesterRole };

// Strategy instantiation
var harvesterStrategy = HarvesterStrategyFactory(Config, rootMessageBus, WorldData);
var strategies = [harvesterStrategy];

// Controller instantiation
var spawnController = SpawnControllerFactory();
var roleController = RoleControllerFactory(Config, roleDefinitions);
var prioritiser = PrioritiserFactory(strategies, spawnController);


module.exports.loop = function () {
  // TODO: Garbage Collection from Memory.creeps/spawns/rooms/flags

  WorldData.init();
  var spawns = _.values(Game.spawns);
  spawnController.init(spawns);
  prioritiser.performSpawns();

  roleController.performRoles(Game.creeps);
};
