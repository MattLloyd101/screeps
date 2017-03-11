const Config = require("./config");

const Transition = (predicate, action) => {

  // must be a function here and not a lambda so we can capture arguments.
  const run = function () {
    const applied = predicate.apply(null, arguments);
    if (applied) {
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

  const transitions = [];

  const addTransition = (otherState, predicate, action) => {

    const transitionAction = (creep) => {
      if (Config.VERBOSE) console.log("Transitioning from '" + stateName + "' to '" + otherState.stateName + "'");
      creep.memory.role = otherState.stateName;

      if (action) action(creep);
    };

    const predicateWithIdCheck = (item) => {
      return stateName === item.memory.role && (predicate ? predicate(item) : true);
    };

    const transition = Transition(predicateWithIdCheck, transitionAction);
    transitions.push(transition);
  };

  return {
    stateName: stateName,
    transitions: transitions,
    addTransition: addTransition
  };
};
