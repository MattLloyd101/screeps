const _ = require("./lodash.poly");
const BodyTypes = require("./config.bodyTypes");

module.exports = (unitPrototype) => {

  const renderedBody = _.flatMap(_.pairs(unitPrototype.body), (bodyTypeCount) => {
    const bodyTypeKey = bodyTypeCount[0];
    const count = bodyTypeCount[1];
    return _.times(count, _.constant(BodyTypes[bodyTypeKey]));
  });


  const _unit = _.extend(unitPrototype, {body: renderedBody});

  const create = () => {
    const translatedBody = _.map(renderedBody, (bodyType) => bodyType.val);

    return _.extend(_unit, {body: translatedBody});
  };

  const buildCost = () => {
    return _.reduce(renderedBody, (out, bodyType) => out + bodyType.buildCost, 0);
  };

  return {
    create: create,
    buildCost: buildCost
  };
};
