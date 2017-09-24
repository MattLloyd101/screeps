const __ = require("../lodash.poly");

const matches = (context, path) => {
  return __.foldl(path, (tuple, pathPart) => {
    const [context, _] = tuple;
    const part = __.isNil(context) ? __.isNil : context[pathPart];

    return [part, !__.isNil(part)];
  }, [context, true])[1];
};

const factoid = (context, path) => {
  return __.foldl(path, (context, pathPart) => {
    if(__.isNil(context)) {
      return null;
    }

    return context[pathPart];
  }, context);
};

const deepSet = (path, fact, context) => {
  context = context || {};
  const initial = __.initial(path);
  const deepContext = __.foldl(initial, (context, pathPart) => {
    let part = context[pathPart];
    if(__.isNil(part)) {
      part = context[pathPart] = {};
    }
    return part;
  }, context);

  const finalPart = __.last(path);
  deepContext[finalPart] = fact;

  return context;
};

const createFact = (path, fact) => {
  return deepSet(path, fact, {});
};

module.exports = {
  factoid,
  deepSet,
  createFact,
  matches
};