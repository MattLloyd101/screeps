var _ = require("./lodash.poly");
var BodyTypes = require("./config.bodyTypes");

module.exports = (unitPrototype) => {

  var renderedBody = _.flatMap(_.pairs(unitPrototype.body), (bodyTypeCount) => {
    var bodyTypeKey = bodyTypeCount[0];
    var count = bodyTypeCount[1];
    return _.times(count, _.constant(BodyTypes[bodyTypeKey]));
  });


  var _unit = _.extend(unitPrototype, { body: renderedBody });

  var create = () => {
    var translatedBody = _.map(renderedBody, (bodyType) => bodyType.val);

    return _.extend(_unit, { body: translatedBody });
  };

  var buildCost = () => {
    return _.reduce(renderedBody, (out, bodyType) => out + bodyType.buildCost, 0);
  };

  return {
    create: create,
    buildCost: buildCost
  };
};
