var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');

describe('World Data', () => {

	describe('#roomData(roomId)', () => {

		it('Should request room data the first time its requested', () => {
      var stubRoomData = {
        data: 42
      };
      var Game = {
        rooms: {
          sim: {
            lookAtArea: sinon.stub().returns(stubRoomData)
          }
        }
      };
      var worldData = require('../worldData')(Game);
      worldData.init();

      var roomData = worldData.roomData('sim');
      expect(Game.rooms.sim.lookAtArea.calledOnce).to.be.true;
      expect(Game.rooms.sim.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);
		});

    it('Should not re-request room data the second time its requested', () => {
      var stubRoomData = {
        data: 42
      };
      var Game = {
        rooms: {
          sim: {
            lookAtArea: sinon.stub().returns(stubRoomData)
          }
        }
      };
      var worldData = require('../worldData')(Game);
      worldData.init();

      var roomData = worldData.roomData('sim');
      expect(Game.rooms.sim.lookAtArea.calledOnce).to.be.true;
      expect(Game.rooms.sim.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);

      var roomData = worldData.roomData('sim');
      expect(Game.rooms.sim.lookAtArea.calledOnce).to.be.true;
    });


    it('Should re-request room data after init has been called', () => {
      var stubRoomData = {
        data: 42
      };
      var Game = {
        rooms: {
          sim: {
            lookAtArea: sinon.stub().returns(stubRoomData)
          }
        }
      };
      var worldData = require('../worldData')(Game);
      worldData.init();

      var roomData = worldData.roomData('sim');
      expect(Game.rooms.sim.lookAtArea.calledOnce).to.be.true;
      expect(Game.rooms.sim.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);

      var roomData = worldData.roomData('sim');
      expect(Game.rooms.sim.lookAtArea.calledOnce).to.be.true;

      worldData.init();

      var roomData = worldData.roomData('sim');
      expect(Game.rooms.sim.lookAtArea.calledTwice).to.be.true;
      expect(Game.rooms.sim.lookAtArea.calledWith(Config.room.TOP, Config.room.LEFT, Config.room.BOTTOM, Config.room.RIGHT, true)).to.be.true;
      expect(roomData).to.equal(stubRoomData);

    });

	});

  describe('#filteredRoomDataByType(roomId, type)', () => {

    it('Should only return the requeted type', () => {
      var stubRoomData = [
        { "type": "source" },
        { "type": "terrain" },
        { "type": "terrain" },
        { "type": "creep" },
        { "type": "source" }
      ];
      var Game = {
        rooms: {
          sim: {
            lookAtArea: sinon.stub().returns(stubRoomData)
          }
        }
      };
      var worldData = require('../worldData')(Game);

      var sources = worldData.filteredRoomDataByType('sim', Config.objectTypes.SOURCE);
      expect(sources).to.have.length(2);
      expect(sources[0].type).to.equal('source');
      expect(sources[1].type).to.equal('source');
    });

  });

});
