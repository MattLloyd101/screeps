const Config = require('./config');

module.exports = (Game, messageBus) => {

  const sendBusMessage = (creep, message) => {
    if (Config.VERBOSE) console.log("Creep(" + creep + ") requesting harvest target: ", JSON.stringify(message));
    messageBus(message);
  };

  const assignTarget = (creep) => {
    return (target) => {
      creep.memory.target = target;
    };
  };

  // Transition Actions
  const removeTarget = (creep) => {
    delete creep.memory.target;
  };

  const askForHarvestTarget = (creep) => {

    const message = {
      type: Config.messageTypes.HARVEST_TARGET_REQUEST,
      pos: creep.pos,
      callback: assignTarget(creep)
    };

    sendBusMessage(creep, message);
  };

  const askForDeliverTarget = (creep) => {

    const message = {
      type: Config.messageTypes.ENERGY_DELIVERY_TARGET_REQUEST,
      pos: creep.pos,
      energy: creep.carry.energy,
      callback: assignTarget(creep)
    };

    sendBusMessage(creep, message);
  };

  const harvest = (creep) => {
    const targetId = creep.memory.target;
    const target = Game.getObjectById(targetId);

    const returnCode = creep.harvest(target);
    const needsToMove = returnCode === Config.errorCodes.ERR_NOT_IN_RANGE;
    if (needsToMove) {
      creep.moveTo(target);
    }
  };

  const deliver = (creep) => {
    const targetId = creep.memory.target;
    const target = Game.getObjectById(targetId);
    const returnCode = creep.transfer(target, Config.resourceType.RESOURCE_ENERGY);
    const needsToMove = returnCode === Config.errorCodes.ERR_NOT_IN_RANGE;
    if (needsToMove) {
      creep.moveTo(target);
    }
  };

  return {
    askForHarvestTarget: askForHarvestTarget,
    askForDeliverTarget: askForDeliverTarget,
    harvest: harvest,
    deliver: deliver,

    removeTarget: removeTarget
  };
};
