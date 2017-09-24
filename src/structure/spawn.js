const Config = require('../config/config');
const ErrorCodes = Config.errorCodes;

module.exports = (baseSpawn) => {

  const canCreateCreep = (body) => baseSpawn.canCreateCreep(body) == ErrorCodes.OK;

  return {
    canCreateCreep
  };
};