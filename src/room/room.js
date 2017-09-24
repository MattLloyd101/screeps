const __ = require('./../utils/lodash.poly.js');
const Config = require('../config/config');
const ObjectTypes = Config.objectTypes;
const SpatialIndex = require('../utils/spatialIndex');

const EnergySource = require('../entities/energySource');

module.exports = () => {

  const create = (baseRoom) => {

    const room = {};

    let _roomDataCache = undefined;
    let _spatialIndex = undefined;
    let _tileTypeLookup = {};

    const clearCache = () => {
      _roomDataCache = undefined;
      _spatialIndex = undefined;
      _tileTypeLookup = {};
    };

    const name = () => {
      return baseRoom.name;
    };

    const roomData = () => {
      if (Config.VERBOSE) console.log("[WorldData] Looking up Room Data for: ", name());

      if (__.isNil(_roomDataCache)) {
        _roomDataCache = baseRoom.lookAtArea(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true);
      }

      return _roomDataCache;
    };

    const dataByType = (type) => {
      if (__.isNil(_tileTypeLookup[type])) {
        _tileTypeLookup[type] = __.filter(roomData(), (data) => data.type === type);
      }

      return _tileTypeLookup[type];
    };

    const spatialIndex = () => {
      if (__.isNil(_spatialIndex)) {
        _spatialIndex = SpatialIndex(roomData());
      }

      return _spatialIndex;
    };

    const lookAtArea = (top, left, bottom, right) => {
      const index = spatialIndex();
      return index.inside(top, left, bottom, right);
    };

    const lookAtAreaByTypes = (top, left, bottom, right, types) => {
      const tiles = lookAtArea(top, left, bottom, right);

      // TODO: Could do with an index over type. Make the spatial index type aware?
      return __.filter(tiles, (tile) => __.contains(types, tile.type));
    };

    const energySources = () => {
      const sourceTiles = dataByType(ObjectTypes.SOURCE);
      // TODO: Cache the mapped tiles
      return __.map(sourceTiles, (tile) => EnergySource(tile.source, room));
    };

    room['baseRoom'] = baseRoom;
    room['name'] = name;
    room['clearCache'] = clearCache;
    room['roomData'] = roomData;
    room['dataByType'] = dataByType;
    room['lookAtArea'] = lookAtArea;
    room['lookAtAreaByTypes'] = lookAtAreaByTypes;
    room['energySources'] = energySources;
    room['structures'] = require('./structures')(room);;
    room['creeps'] = require('./creeps')(room);

    return room;
  };

  return {
    create
  };
};