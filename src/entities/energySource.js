const __ = require("./../utils/lodash.poly.js");
const Config = require('./../config/config');
const ObjectTypes = Config.objectTypes;
const TerrainTypes = Config.terrainTypes;

module.exports = (source, room) => {

  const x = source.pos.x;
  const y = source.pos.y;

  const numberOfWorkableTiles = () => {

    const tiles = room.lookAtAreaByTypes(y - 1, x - 1, y + 1, x + 1, [ObjectTypes.TERRAIN]);
    const workableTiles = __.filter(tiles, (tile) => {
      return tile.terrain === TerrainTypes.PLAIN;
    });

    return workableTiles.length;
  };

  return {
    numberOfWorkableTiles
  };
};
