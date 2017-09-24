const __ = require("lodash");

module.exports = __.extend(__, {
  flatMap: __.compose(__.flatten, __.map),
  isNil: (value) => __.isUndefined(value) || __.isNull(value)
});
