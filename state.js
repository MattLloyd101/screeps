var Config = require("./config");
var Role = require("./role");

var Transition = (predicate, action) => {

  // must be a function here and not a lambda so we can capture arguments.
  var run = function () {
    var applied = predicate.apply(null, arguments)
    if(applied) {
      action.apply(null, arguments)
    }

    return applied;
  };

  return {
    test: predicate,
    apply: run
  };
};

module.exports = (stateName) => {

  var transitions = [];

  var addTransition = (otherState, predicate, action) => {

    var transitionAction = (creep) => {
      if(Config.VERBOSE) console.log("Transitioning from '" + stateName + "' to '" + otherState.stateName + "'");
      creep.memory.role = otherState.stateName;

      if(action) action(creep);
    };

    var predicateWithIdCheck = (item) => {
      return stateName === item.memory.role && (predicate ? predicate(item) : true);
    };

    var transition = Transition(predicateWithIdCheck, transitionAction);
    transitions.push(transition);
  };

  return {
    stateName: stateName,
    transitions: transitions,
    addTransition: addTransition
  };
};
