const _ = require("lodash");

module.exports = _.extend(_, {
  flatMap: _.compose(_.flatten, _.map),
  isNil: (value) => _.isUndefined(value) || _.isNull(value)
});
