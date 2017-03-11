const _ = require('./lodash.poly');

const decomposeRole = (role) => {
  const parts = _.words(role, /[^.]+/g);

  const out = {};
  if (parts[0] !== undefined) out.master = parts[0];
  if (parts[1] !== undefined) out.sub = parts[1];
  if (parts[2] !== undefined) out.state = parts[2];

  return out;
};

const composeRole = (roleBase, ignoreState) => {
  const parts = ignoreState ? [roleBase.master, roleBase.sub] : [roleBase.master, roleBase.sub, roleBase.state];

  return _.compact(parts).join(".");
};

const getRoleTypeId = (role) => {
  const decomposedRole = decomposeRole(role);
  return composeRole(decomposedRole, true);
};

const getMaster = (role) => {
  const decomposedRole = decomposeRole(role);
  return decomposedRole.master;
};

const getSub = (role) => {
  const decomposedRole = decomposeRole(role);
  return decomposedRole.sub;
};

const getState = (role) => {
  const decomposedRole = decomposeRole(role);
  return decomposedRole.state;
};

const testMaster = (masterRole) => {
  return (creep) => {
    const role = creep.memory.role;
    return getMaster(role) === masterRole;
  }
};

module.exports = {
  decomposeRole,
  composeRole,
  getRoleTypeId,
  getMaster,
  getSub,
  getState,
  testMaster
};
