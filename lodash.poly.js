var _ = require("lodash");

module.exports = _.extend(_, { flatMap: _.compose(_.flatten, _.map) });
