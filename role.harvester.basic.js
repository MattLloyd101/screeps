var _ = require('./lodash.poly');
var Config = require('./config');
var State = require('./state');
var Role = require('./role');
var RoleType = "harvester.basic";

module.exports = (messageBus) => {

  // Predicates
  var isFull = (creep) => {
    // TODO: What if we are carring more than just energy?
    return creep.carry.energy >= creep.carryCapacity;
  };

  var hasTarget = (creep) => {
    var target = creep.memory.target;
    return _.isUndefined(target) ? false : !_.isUndefined(target.x) && !_.isUndefined(target.y);
  };

  var hasDepositedAllEnergy = (creep) => {
    return creep.carry.energy === 0;
  };

  // Transition Actions
  var removeTarget = (creep) => {
    delete creep.memory.target;
  }

  // States & Transitions
  var RootState = State(RoleType);
  var NeedsHarvestTargetState = State(RoleType + ".needsHarvestTarget");
  var HarvestingState = State(RoleType + ".harvesting");
  var NeedsDeliverTargetState = State(RoleType + ".needsDeliverTarget");
  var Delivering = State(RoleType + ".delivering");

  RootState.addTransition(NeedsHarvestTargetState);
  NeedsHarvestTargetState.addTransition(HarvestingState, hasTarget);
  // TODO: Add transition to NeedsHarvestTarget if the target is no longer valid.
  HarvestingState.addTransition(NeedsDeliverTargetState, isFull, removeTarget);
  NeedsDeliverTargetState.addTransition(Delivering, hasTarget);
  Delivering.addTransition(NeedsHarvestTargetState, hasDepositedAllEnergy, removeTarget);

  var states = [ RootState, NeedsHarvestTargetState, HarvestingState,
    NeedsDeliverTargetState, Delivering ];

  var allTransitions = _.flatMap(states, (state) => state.transitions);

  // Sub Roles
  var askForHarvestTarget = (creep) => {
    var assignTarget = (target) => {
      creep.memory.target = target;
    };

    var message = {
      type: Config.HARVEST_TARGET_REQUEST,
      pos: creep.pos,
      callback: assignTarget
    };

    messageBus(message);
  };

  var harvest = (creep) => {
    var target = creep.memory.target;
    var returnCode = creep.harvest(target);
    var needsToMove = returnCode === Config.errorCodes.ERR_NOT_IN_RANGE;
    if(needsToMove) {
      creep.moveTo(target);
    }
  };

  // Logic
  var transition = (creep) => {
    return _.any(allTransitions, (transition) => transition.apply(creep));
  };

  var run = (creep) => {
    var role = creep.memory.role;
    var state = Role.getState(role);

    switch(state) {
      case 'needsHarvestTarget':
        askForHarvestTarget(creep);
      break;

      case 'harvesting':
        harvest(creep);
      break;

      case 'needsDeliverTarget':

      break;

      case 'delivering':

      break;

      default:
    }
  };

  return {
    roleType: RoleType,
    transition: transition,
    run: run
  };
};
