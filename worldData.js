var _ = require('./lodash.poly');
var Config = require('./config');

module.exports = (Game) => {

  var _roomCache = {};

  var init = () => {
    _roomCache = {};
  };

  var roomData = (roomId) => {

    if(roomId in _roomCache) return _roomCache[roomId];

    if(Config.VERBOSE) console.log("[WorldData] Looking up Room Data for: ", roomId);

    var room = Game.rooms[roomId];
    var data = room.lookAtArea(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true);
    _roomCache[roomId] = data;

    return data;
  };

  var filteredRoomDataByType = (roomId, type) => {
    return _.filter(roomData(roomId), (data) => data.type == type);
  };

  return {
    init: init,
    roomData: roomData,
    filteredRoomDataByType: filteredRoomDataByType
  };
};
