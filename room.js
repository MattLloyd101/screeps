const _ = require('./lodash.poly');
const Config = require('./config');
const ObjectTypes = Config.objectTypes;
const SpatialIndex = require('./spatialIndex');

module.exports = () => {

  const create = (baseRoom) => {

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

      if(_.isNil(_roomDataCache)) {
        _roomDataCache = baseRoom.lookAtArea(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true);
      }

      return _roomDataCache;
    };

    const dataByType = (type) => {
      if(_.isNil(_tileTypeLookup[type])) {
        _tileTypeLookup[type] = _.filter(roomData(), (data) => data.type === type);
      }

      return _tileTypeLookup[type];
    };

    const spatialIndex = () => {
      if(_.isNil(_spatialIndex)) {
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
      return _.filter(tiles, (tile) => _.contains(types, tile.type));
    };

    const energySources = () => {
      const sourceTiles = dataByType(ObjectTypes.SOURCE);
      // TODO: Cache the mapped tiles
      return _.map(sourceTiles, (tile) => tile.source);
    };

    const structures = () => {
      const sourceTiles = dataByType(ObjectTypes.STRUCTURE);
      return _.map(sourceTiles, (tile) => tile.structure);
    };

    const creepsInArea = (top, left, bottom, right) => {
      const creeps = lookAtAreaByTypes(top, left, bottom, right, [ObjectTypes.CREEP]);
      return _.map(creeps, (tile) => tile.creep);
    };

    const enemyCreepsInArea = (top, left, bottom, right) => {
      const creeps = creepsInArea(top, left, bottom, right);
      return _.filter(creeps, (creep) => !creep._my);
    };

    return {
      name,
      clearCache,

      roomData,
      dataByType,

      lookAtArea,
      lookAtAreaByTypes,


      energySources,
      structures,

      creepsInArea,
      enemyCreepsInArea
    };
  };

  return {
    create
  };
};