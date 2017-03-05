var _ = require('./lodash.poly');
var Config = require('./config');

module.exports = (Game) => {

  var _rooms = undefined;
  var _roomCache = {};
  var _spatialIndex = {};

  var init = () => {
    _rooms = undefined;
    _roomCache = {};
    _spatialIndex = {};
  };

  var spatialKey = (x, y) => x + "." + y

  var roomData = (roomId) => {

    if(roomId in _roomCache) return _roomCache[roomId];

    if(Config.VERBOSE) console.log("[WorldData] Looking up Room Data for: ", roomId);

    var room = Game.rooms[roomId];
    var data = room.lookAtArea(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true);
    _roomCache[roomId] = data;
    _.each(data, (entry) => {
      var key = spatialKey(entry.x, entry.y);

      var arr = _spatialIndex[key] || [];
      arr[arr.length] = entry;
      _spatialIndex[key] = arr;
    });

    return data;
  };

  var filteredRoomDataByType = (roomId, type) => {
    return _.filter(roomData(roomId), (data) => data.type === type);
  };

  var filteredStructureByType = (roomId, type) => {
    var structureTiles = _.filter(roomData(roomId), (data) => {
      var isStructure = data.type === Config.objectTypes.STRUCTURE;

      if(!isStructure || _.isNil(data.structure)) return false;

      return data.structure.structureType === type;
    });
    return _.map(structureTiles, (tile) => tile.structure);
  };

  var rooms = () => {
    if(_.isNil(_rooms)) {
      _rooms = _.values(Game.rooms);
    }

    return _rooms;
  };

  var lookAtArea = (roomName, top, left, bottom, right) => {
    var data = roomData(roomName);
    var out = [];
    for (var y = top; y <= bottom; y++) {
      for (var x = left; x <= right; x++) {
        var key = spatialKey(x, y);
        out = out.concat(_spatialIndex[key]);
      }
    }

    return _.compact(out);
  };

  var allCreeps = () => {
    return _.flatMap(rooms(), (room) => {
      var data = roomData(room.name);
      var creeps = _.filter(data, (entry) => entry.type === Config.objectTypes.CREEP);
      return _.map(creeps, (entry) => entry.creep);
    });
  };

  var enemiesInArea = (roomName, top, left, bottom, right) => {
    var data = lookAtArea(roomName, top, left, bottom, right);
    var enemyCreeps = _.filter(data, (entry) => {
      if(entry.type !== Config.objectTypes.CREEP) return false;
      var creep = entry.creep;
      return !creep.my;
    });

    return enemyCreeps.length > 0;
  };

  return {
    init: init,
    roomData: roomData,
    filteredRoomDataByType: filteredRoomDataByType,
    filteredStructureByType: filteredStructureByType,
    rooms: rooms,
    lookAtArea: lookAtArea,
    allCreeps: allCreeps,
    enemiesInArea: enemiesInArea
  };
};
