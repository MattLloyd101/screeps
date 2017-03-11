const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');
const ObjectTypes = Config.objectTypes;

const createRoom = (testRoomData) => {
  const stubRoomData = testRoomData || {};
  const baseRoom = {
    lookAtArea: sinon.stub().returns(stubRoomData)
  };
  const RoomFactory = require('../room')();
  const room = RoomFactory.create(baseRoom);
  return {stubRoomData, baseRoom, room};
};

describe('Room', () => {

  describe('#create(baseRoom)', () => {

    it('Should return a new room', () => {
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom();

      expect(room).to.not.be.undefined;
    });

  });

  describe('#name()', () => {

    it('Should take the room name from the supplied baseRoom', () => {
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom();

      const roomName = room.name();
      expect(roomName).to.equal(baseRoom.name);
    });

  });

  describe('#roomData()', () => {

    it('Should request room data the first time its requested', () => {
      const {stubRoomData, baseRoom, room} = createRoom();
      const roomData = room.roomData();
      expect(baseRoom.lookAtArea.calledOnce).to.be.true;
      expect(baseRoom.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);
    });

    it('Should not re-request room data the second time its requested', () => {
      const {stubRoomData, baseRoom, room} = createRoom();

      let roomData = room.roomData();
      expect(baseRoom.lookAtArea.calledOnce).to.be.true;
      expect(baseRoom.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);

      //noinspection JSUnusedAssignment
      roomData = room.roomData();
      expect(baseRoom.lookAtArea.calledOnce).to.be.true;
    });

    it('Should re-request room data after clearCache has been called', () => {
      const {stubRoomData, baseRoom, room} = createRoom();

      let roomData = room.roomData();
      expect(baseRoom.lookAtArea.calledOnce).to.be.true;
      expect(baseRoom.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);

      room.clearCache();

      //noinspection JSUnusedAssignment
      roomData = room.roomData();
      expect(baseRoom.lookAtArea.calledTwice).to.be.true;
      expect(baseRoom.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
    });
  });

  describe('#dataByType(roomType)', () => {

    it('Should return only tiles that match the passed roomType', () => {
      let testRoomData = [
        {"type": "source"},
        {"type": "terrain"},
        {"type": "terrain"},
        {"type": "creep"},
        {"type": "source"}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);

      const sources = room.dataByType(ObjectTypes.SOURCE);
      expect(sources).to.have.length(2);
      expect(sources[0].type).to.equal(ObjectTypes.SOURCE);
      expect(sources[1].type).to.equal(ObjectTypes.SOURCE);
    });

  });

  describe('#energySources()', () => {

    it('Should return the source objects from the tiles', () => {
      const source1 = {};
      const source2 = {};
      const testRoomData = [
        {"type": "source", source: source1},
        {"type": "terrain"},
        {"type": "terrain"},
        {"type": "creep"},
        {"type": "source", source: source2}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);

      const sources = room.energySources();
      expect(sources).to.have.length(2);
      expect(sources[0]).to.equal(source1);
      expect(sources[1]).to.equal(source2);
    });

  });

  describe('#energySources()', () => {

    it('Should return the source objects from the tiles', () => {
      const structure1 = {};
      const structure2 = {};
      const testRoomData = [
        {"type": "source"},
        {"type": "terrain"},
        {"type": "structure", structure: structure1 },
        {"type": "terrain"},
        {"type": "structure", structure: structure2 },
        {"type": "creep"},
        {"type": "source"}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);

      const structures = room.structures();
      expect(structures).to.have.length(2);
      expect(structures[0]).to.equal(structure1);
      expect(structures[1]).to.equal(structure2);
    });

  });

  describe('#lookAtArea(top, left, bottom, right)', () => {

    it('Should return all tiles in the area', () => {
      const testRoomData = [
        { x:0, y: 0},
        { x:1, y: 1},
        { x:2, y: 2},
        { x:3, y: 3},
        { x:4, y: 4},
        { x:5, y: 5},
        { x:6, y: 6}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);
      const tiles = room.lookAtArea(1,1,5,5);

      expect(tiles).to.have.length(5);
      expect(tiles).to.contain(testRoomData[1]);
      expect(tiles).to.contain(testRoomData[2]);
      expect(tiles).to.contain(testRoomData[3]);
      expect(tiles).to.contain(testRoomData[4]);
      expect(tiles).to.contain(testRoomData[5]);
    });

  });

  describe('#lookAtAreaByType(top, left, bottom, right, type)', () => {

    it('Should return all tiles of the supplied type in the area', () => {
      const testRoomData = [
        { x:0, y: 0, type: ObjectTypes.STRUCTURE},
        { x:1, y: 1, type: ObjectTypes.TERRAIN},
        { x:2, y: 2, type: ObjectTypes.TERRAIN},
        { x:3, y: 3, type: ObjectTypes.MINERAL},
        { x:4, y: 4, type: ObjectTypes.STRUCTURE},
        { x:5, y: 5, type: ObjectTypes.SOURCE},
        { x:6, y: 6, type: ObjectTypes.TERRAIN}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);
      const tiles = room.lookAtAreaByTypes(1,1,5,5, [ObjectTypes.TERRAIN]);

      expect(tiles).to.have.length(2);
      expect(tiles).to.contain(testRoomData[1]);
      expect(tiles).to.contain(testRoomData[2]);
    });

    it('Should return all tiles of all of the supplied types in the area', () => {
      const testRoomData = [
        { x:0, y: 0, type: ObjectTypes.STRUCTURE},
        { x:1, y: 1, type: ObjectTypes.TERRAIN},
        { x:2, y: 2, type: ObjectTypes.TERRAIN},
        { x:3, y: 3, type: ObjectTypes.MINERAL},
        { x:4, y: 4, type: ObjectTypes.STRUCTURE},
        { x:5, y: 5, type: ObjectTypes.SOURCE},
        { x:6, y: 6, type: ObjectTypes.TERRAIN}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);
      const tiles = room.lookAtAreaByTypes(1,1,5,5, [ObjectTypes.TERRAIN, ObjectTypes.MINERAL]);

      expect(tiles).to.have.length(3);
      expect(tiles).to.contain(testRoomData[1]);
      expect(tiles).to.contain(testRoomData[2]);
      expect(tiles).to.contain(testRoomData[3]);
    });
  });

  describe('#creepsInArea(top, left, bottom, right)', () => {

    it('Should return all creeps in the area', () => {
      const testRoomData = [
        { x:0, y: 0, type: ObjectTypes.STRUCTURE},
        { x:1, y: 1, type: ObjectTypes.TERRAIN},
        { x:2, y: 2, type: ObjectTypes.CREEP, creep: {}},
        { x:3, y: 3, type: ObjectTypes.MINERAL},
        { x:4, y: 4, type: ObjectTypes.CREEP, creep: {}},
        { x:5, y: 5, type: ObjectTypes.SOURCE},
        { x:6, y: 6, type: ObjectTypes.CREEP, creep: {}}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);
      const tiles = room.creepsInArea(1,1,5,5);

      expect(tiles).to.have.length(2);
      expect(tiles).to.contain(testRoomData[2].creep);
      expect(tiles).to.contain(testRoomData[4].creep);
    });

  });

  describe('#enemyCreepsInArea(top, left, bottom, right)', () => {

    it('Should return all enemy creeps in the area', () => {
      const testRoomData = [
        { x:0, y: 0, type: ObjectTypes.STRUCTURE},
        { x:1, y: 1, type: ObjectTypes.TERRAIN},
        { x:2, y: 2, type: ObjectTypes.CREEP, creep: { _my: false }},
        { x:3, y: 3, type: ObjectTypes.MINERAL},
        { x:4, y: 3, type: ObjectTypes.CREEP, creep: { _my: false }},
        { x:4, y: 4, type: ObjectTypes.CREEP, creep: { _my: true }},
        { x:5, y: 5, type: ObjectTypes.SOURCE},
        { x:6, y: 6, type: ObjectTypes.CREEP, creep: {}}
      ];
      //noinspection JSUnusedLocalSymbols
      const {stubRoomData, baseRoom, room} = createRoom(testRoomData);
      const tiles = room.enemyCreepsInArea(1,1,5,5);

      expect(tiles).to.have.length(2);
      expect(tiles).to.contain(testRoomData[2].creep);
      expect(tiles).to.contain(testRoomData[4].creep);
    });

  });

});
