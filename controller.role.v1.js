var _ = require('./lodash.poly');
var Config = require("./config");
var getRoleTypeId = require('./role').getRoleTypeId;

module.exports = (Config, roleDefinitions) => {

  var getRoleDefinition = (role) => {
    var roleId = getRoleTypeId(role);
    return roleDefinitions[roleId];
  };

  var performTransition = (creep) => {
    var definedRole = getRoleDefinition(creep.memory.role);

    if(!definedRole) return false;

    return definedRole.transition(creep);
  };

  var performRole = (creep) => {
    var definedRole = getRoleDefinition(creep.memory.role);
    if(definedRole) {
      definedRole.run(creep);
    }
  };

  // We retry transitions in case there are some some instant transitions
  // the iterationMax is a safety thing to ensure we don't end up in an infinite
  // loop with an instantly resolving state loop
  var performTransitions = (creeps, depth) => {
    depth = depth || 0;
    if(depth >= Config.IterationMax) {
      if(Config.CRITICAL) console.log("[CRITICAL] controller.role.v1::performTransitions hit iterationMax(" + depth + ") creeps(" + JSON.stringify(creeps) + ")");
      return;
    }

    var retryList = _.filter(creeps, performTransition);
    if(retryList.length > 0) performTransitions(retryList, depth + 1);
  };

  var performRoles = (creeps) => {
    performTransitions(creeps);
    _.each(creeps, performRole);
  };


  return {
    performRoles: performRoles,
    performRole: performRole
  };

};
