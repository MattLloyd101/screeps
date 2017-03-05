var _ = require('./lodash.poly');

var decomposeRole = (role) => {
  var parts = _.words(role, /[^\.]+/g);

  var out = {};
  if(parts[0] !== undefined) out.master = parts[0];
  if(parts[1] !== undefined) out.sub = parts[1];
  if(parts[2] !== undefined) out.state = parts[2];

  return out;
};

var composeRole = (roleBase, ignoreState) => {
  var parts = ignoreState ? [roleBase.master, roleBase.sub] : [roleBase.master, roleBase.sub, roleBase.state];

  return _.compact(parts).join(".");
};

var getRoleTypeId = (role) => {
  var decomposedRole = decomposeRole(role);
  return composeRole(decomposedRole, true);
};

var getState = (role) => {
  var decomposedRole = decomposeRole(role);
  return decomposedRole.state;
}

module.exports = {
  decomposeRole: decomposeRole,
  composeRole: composeRole,
  getRoleTypeId: getRoleTypeId,
  getState: getState
};
