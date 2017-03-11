const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');

describe('World Data', () => {

  describe('#roomByName(roomName)', () => {

    it('Should return a room when the name matches', () => {
      const Game = {
        rooms: {
          sim: {
            name: "sim"
          }
        }
      };
      const createdRoom = {
        name: sinon.stub().returns("sim")
      };
      const roomFactory = {
        create: sinon.stub().returns(createdRoom)
      };
      const worldData = require('../worldData')(Game, roomFactory);
      const foundRoom = worldData.roomByName("sim");

      expect(foundRoom).to.equal(createdRoom);
    });

    it('Should return undefined when no name matches', () => {
      const Game = {
        rooms: {}
      };
      const roomFactory = {
        create: sinon.spy()
      };
      const worldData = require('../worldData')(Game, roomFactory);
      const foundRoom = worldData.roomByName("sim");

      expect(foundRoom).to.be.undefined;
    });
  });

  describe('#allSeenRooms()', () => {

    it('Should request room data the first time its requested', () => {
      const room1 = {
        name: "sim"
      };
      const room2 = {
        name: "room2"
      };
      const Game = {
        rooms: {
          sim: room1,
          room2: room2
        }
      };
      const roomFactory = {
        create: sinon.spy()
      };
      const worldData = require('../worldData')(Game, roomFactory);

      const rooms = worldData.allSeenRooms();
      expect(roomFactory.create.calledTwice).to.be.true;
      expect(rooms).to.have.length(2);
    });

    it('Should not call the factory when no rooms are defined', () => {
      const Game = {
        rooms: {}
      };
      const roomFactory = {
        create: sinon.spy()
      };
      const worldData = require('../worldData')(Game, roomFactory);

      const rooms = worldData.allSeenRooms();
      expect(roomFactory.create.called).to.be.false;
      expect(rooms).to.have.length(0);
    });
  });


  //
  // describe('#filteredRoomDataByType(roomId, type)', () => {
  //
  //   it('Should only return the requested type', () => {
  //     const stubRoomData = [
  //       {"type": "source"},
  //       {"type": "terrain"},
  //       {"type": "terrain"},
  //       {"type": "creep"},
  //       {"type": "source"}
  //     ];
  //     const Game = {
  //       rooms: {
  //         sim: {
  //           lookAtArea: sinon.stub().returns(stubRoomData)
  //         }
  //       }
  //     };
  //     const worldData = require('../worldData')(Game);
  //
  //     const sources = worldData.filteredRoomDataByType('sim', Config.objectTypes.SOURCE);
  //     expect(sources).to.have.length(2);
  //     expect(sources[0].type).to.equal(Config.objectTypes.SOURCE);
  //     expect(sources[1].type).to.equal(Config.objectTypes.SOURCE);
  //   });
  //
  // });
  //
  // describe('#filteredStructureByType(roomId, type)', () => {
  //
  //   it('Should only return the requested type', () => {
  //     const stubRoomData = [
  //       {
  //         "type": "structure",
  //         "structure": {
  //           structureType: "spawn"
  //         }
  //       },
  //       {"type": "terrain"},
  //       {
  //         "type": "structure",
  //         "structure": {
  //           structureType: "controller"
  //         }
  //       },
  //       {"type": "creep"},
  //       {"type": "source"},
  //       {
  //         "type": "structure",
  //         "structure": {
  //           structureType: "spawn"
  //         }
  //       },
  //     ];
  //     const Game = {
  //       rooms: {
  //         sim: {
  //           lookAtArea: sinon.stub().returns(stubRoomData)
  //         }
  //       }
  //     };
  //     const worldData = require('../worldData')(Game);
  //
  //     const sources = worldData.filteredStructureByType('sim', Config.structureTypes.SPAWN);
  //     expect(sources).to.have.length(2);
  //     expect(sources[0].structureType).to.equal(Config.structureTypes.SPAWN);
  //     expect(sources[1].structureType).to.equal(Config.structureTypes.SPAWN);
  //   });
  //
  // });
  //
  // describe('#rooms()', () => {
  //
  //   it('Should return a list of rooms', () => {
  //     const room1 = {};
  //     const room2 = {};
  //     const Game = {
  //       rooms: {
  //         room1: room1,
  //         room2: room2
  //       }
  //     };
  //     const worldData = require('../worldData')(Game);
  //
  //     const rooms = worldData.rooms();
  //     expect(rooms).to.have.length(2);
  //     expect(rooms[0]).to.equal(room1);
  //     expect(rooms[1]).to.equal(room2);
  //   });
  //
  // });

});
