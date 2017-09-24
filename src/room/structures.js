const __ = require('./../lodash.poly.js');
const Config = require('../config/config');

const ObjectTypes = Config.objectTypes;
const StructureTypes = Config.structureTypes;

const SpawnFactory = require('../structure/spawn');

module.exports = function (room) {

  const all = () => {
    const sourceTiles = room.dataByType(ObjectTypes.STRUCTURE);
    return __.map(sourceTiles, (tile) => tile.structure);
  };

  const structuresByType = (type) => {
    return __.filter(all(), (structure) => structure.structureType == type);
  };

  const spawns = () => {
    const baseSpawns = structuresByType(StructureTypes.SPAWN);

    return __.map(baseSpawns, SpawnFactory);
  };

  return {
    all,

    spawns
  }
};
