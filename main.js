// const _ = require('./lodash.poly');
// const Config = require('./config');
//
// //noinspection JSUnresolvedVariable
// const GameObj = Game;
// const rootMessageBus = require('./messageBus')();
//
// const WorldData = require('./worldData')(GameObj);
//
// // Controllers
// const PrioritiserFactory = require('./controller.prioritiser.js');
// const RoleControllerFactory = require('./controller.role.js');
// const SpawnControllerFactory = require('./controller.spawn.js');
//
// // Strategies
// const HarvesterStrategyFactory = require('./strategy.harvester.js');
// const SpawnStrategyFactory = require('./strategy.spawn.js');
// const ControllerStrategyFactory = require('./strategy.controller.js');
//
// // Roles
// const BasicHarvesterRoleFactory = require('./role.harvester.basic');
//
// // Role instantiation
// const basicHarvesterRole = BasicHarvesterRoleFactory(GameObj, rootMessageBus);
// const roleDefinitions = {"harvester.basic": basicHarvesterRole};
//
// // Strategy instantiation
// const harvesterStrategy = HarvesterStrategyFactory(Config, rootMessageBus, WorldData);
// const spawnStrategy = SpawnStrategyFactory(Config, rootMessageBus, WorldData);
// const controllerStrategy = ControllerStrategyFactory(Config, rootMessageBus, WorldData);
// const strategies = [harvesterStrategy, spawnStrategy, controllerStrategy];
//
// // Controller instantiation
// const spawnController = SpawnControllerFactory(spawnStrategy);
// const roleController = RoleControllerFactory(Config, roleDefinitions);
// const prioritiser = PrioritiserFactory(strategies, spawnController, rootMessageBus);
//
//
// module.exports.loop = function () {
//     // TODO: Garbage Collection from Memory.creeps/spawns/rooms/flags
//
//     WorldData.init();
//     const spawns = _.values(GameObj.spawns);
//     spawnController.init(spawns);
//     prioritiser.performSpawns();
//
//     roleController.performRoles(GameObj.creeps);
// };
//
//
