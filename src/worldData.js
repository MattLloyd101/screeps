const __ = require('./lodash.poly.js');

module.exports = (Game, roomFactory) => {

  let _rooms = undefined;

  const clearCache = () => {
    if(!__.isNil(_rooms)) {
      __.each(_rooms, (room) => room.clearCache());
    }

    _rooms = undefined;
  };

  const allSeenRooms = () => {
    if(__.isNil(_rooms)) {
      _rooms = __.map(__.values(Game.rooms), roomFactory.create);
    }

    return _rooms;
  };

  const roomByName = (roomName) => {
    const rooms = allSeenRooms();
    return __.find(rooms, (room) => roomName === room.name());
  };

  return {
    clearCache,

    allSeenRooms,
    roomByName
  };
};

