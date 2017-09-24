const __ = require('./../utils/lodash.poly.js');
const Config = require('../config/config');
const ObjectTypes = Config.objectTypes;

module.exports = function (room) {

  const creepsInArea = (top, left, bottom, right) => {
    const creeps = room.lookAtAreaByTypes(top, left, bottom, right, [ObjectTypes.CREEP]);
    return __.map(creeps, (tile) => tile.creep);
  };

  const all = () => {
    return creepsInArea(0, 0, 49, 49);
  };

  return {
      all,
      creepsInArea
  }
};
