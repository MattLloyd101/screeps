const __ = require('./../utils/lodash.poly.js');
const RulePath = require("./rulePath");

const dynamicFactPath = ["__dynamicFacts"];

const dynamicFacts = (root) => {
  return RulePath.factoid(root, dynamicFactPath);
};

const rule = (condition) => (consequence) => {
  return {
    priority: 1,
    on: true,
    "condition": function (R) {
      const fact = this;

      R.when(!__.isNil(fact) && condition(fact));
    },
    "consequence": function(R) {
      const fact = this;

      consequence(R, fact);
    }
  }
};

const dyanmicFact = (fact, root) => {
  const existingFacts = root.__dynamicFacts = root.__dynamicFacts || [];

  root.__dynamicFacts = [].concat(existingFacts, fact);
};

const fact = (path, fact, context) => {
  return RulePath.deepSet(path, fact, context);
};

module.exports = {
  rule,
  fact,
  dyanmicFact,
  dynamicFacts
};