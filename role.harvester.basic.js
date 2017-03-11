const _ = require('./lodash.poly');
const State = require('./state');
const Role = require('./role');
const RoleType = "harvester.basic";

module.exports = (Game, behaviour) => {

  // Predicates
  const isFull = (creep) => {
    // TODO: What if we are carrying more than just energy?
    return creep.carry.energy >= creep.carryCapacity;
  };

  const hasTarget = (creep) => {
    const targetId = creep.memory.target;
    const target = Game.getObjectById(targetId);

    const hasTarget = !_.isNil(target);
    if (!hasTarget) return false;

    const pos = target.pos;
    const hasPos = !_.isNil(pos);
    if (!hasPos) return false;

    return !_.isNil(pos.x) && !_.isNil(pos.y) && !_.isNil(pos.roomName);
  };

  const hasDepositedAllEnergy = (creep) => {
    return creep.carry.energy === 0;
  };

  // States & Transitions
  const RootState = State(RoleType);
  const NeedsHarvestTargetState = State(RoleType + ".needsHarvestTarget");
  const HarvestingState = State(RoleType + ".harvesting");
  const NeedsDeliverTargetState = State(RoleType + ".needsDeliverTarget");
  const Delivering = State(RoleType + ".delivering");

  RootState.addTransition(NeedsHarvestTargetState);
  NeedsHarvestTargetState.addTransition(HarvestingState, hasTarget);
  // TODO: Add transition to NeedsHarvestTarget if the target is no longer valid.
  HarvestingState.addTransition(NeedsDeliverTargetState, isFull, behaviour.removeTarget);
  NeedsDeliverTargetState.addTransition(Delivering, hasTarget);
  Delivering.addTransition(NeedsHarvestTargetState, hasDepositedAllEnergy, behaviour.removeTarget);

  const states = [RootState, NeedsHarvestTargetState, HarvestingState,
    NeedsDeliverTargetState, Delivering];

  const allTransitions = _.flatMap(states, (state) => state.transitions);

  const transition = (creep) => {
    return _.any(allTransitions, (transition) => transition.apply(creep));
  };

  const run = (creep) => {
    const role = creep.memory.role;
    const state = Role.getState(role);

    switch (state) {
      case 'needsHarvestTarget':
        behaviour.askForHarvestTarget(creep);
      break;

      case 'harvesting':
        behaviour.harvest(creep);
      break;

      case 'needsDeliverTarget':
        behaviour.askForDeliverTarget(creep);
      break;

      case 'delivering':
        behaviour.deliver(creep);
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
