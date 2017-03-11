const _ = require('./lodash.poly');
const getRoleTypeId = require('./role').getRoleTypeId;

module.exports = (Config, roleDefinitions) => {

  const getRoleDefinition = (role) => {
    const roleId = getRoleTypeId(role);
    return roleDefinitions[roleId];
  };

  const performTransition = (creep) => {
    const definedRole = getRoleDefinition(creep.memory.role);

    if (!definedRole) return false;

    return definedRole.transition(creep);
  };

  const performRole = (creep) => {
    const definedRole = getRoleDefinition(creep.memory.role);
    if (definedRole) {
      definedRole.run(creep);
    }
  };

  // We retry transitions in case there are some some instant transitions
  // the iterationMax is a safety thing to ensure we don't end up in an infinite
  // loop with an instantly resolving state loop
  const performTransitions = (creeps, depth) => {
    depth = depth || 0;
    if (depth >= Config.IterationMax) {
      if (Config.CRITICAL) console.log("[CRITICAL] controller.role.v1::performTransitions hit iterationMax(" + depth + ") creeps(" + JSON.stringify(creeps) + ")");
      return;
    }

    const retryList = _.filter(creeps, performTransition);
    if (retryList.length > 0) performTransitions(retryList, depth + 1);
  };

  const performRoles = (creeps) => {
    performTransitions(creeps);
    _.each(creeps, performRole);
  };


  return {
    performRoles: performRoles,
    performRole: performRole
  };

};
