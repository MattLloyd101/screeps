const __ = require("./utils/lodash.poly.js");
const BodyTypes = require("./config/bodyTypes.js");

module.exports = (unitPrototype) => {

  const body = __.flatMap(__.pairs(unitPrototype.body), (bodyTypeCount) => {
    const bodyTypeKey = bodyTypeCount[0];
    const count = bodyTypeCount[1];
    return __.times(count, __.constant(BodyTypes[bodyTypeKey]));
  });


  // const _unit = __.extend(unitPrototype, {body: renderedBody});

  // const translatedBody = __.map(renderedBody, (bodyType) => bodyType.val);
  // const body = __.extend(_unit, {body: translatedBody});

  const buildCost = __.reduce(body, (out, bodyType) => out + bodyType.buildCost, 0);

  const initialMemory = unitPrototype.initialMemory;

  return {
    body,
    buildCost,
    initialMemory
  };
};
