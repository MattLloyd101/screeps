const _ = require('./lodash.poly');

module.exports = (Game, roomFactory) => {

  const allSeenRooms = () => {
    return _.map(_.values(Game.rooms), roomFactory.create);
  };

  const roomByName = (roomName) => {
    const rooms = allSeenRooms();
    return _.find(rooms, (room) => roomName === room.name());
  };

  return {
    allSeenRooms,
    roomByName
  };
};
