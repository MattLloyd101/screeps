const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');
const MessageTypes = Config.messageTypes;
const ObjectTypes = Config.objectTypes;
const TerrainTypes = Config.terrainTypes;


describe('Harvester Controller', () => {

  describe('#startListening()', () => {

    it('Should start listening to messages', () => {
      const messageBus = {
        addListener: sinon.spy()
      };

      const harvesterController = require('../controller.harvester')(messageBus);

      expect(messageBus.addListener.calledOnce).to.be.false;
      harvesterController.startListening();
      expect(messageBus.addListener.calledOnce).to.be.true;
    });

  });

  describe('#handleMessage(message)', () => {

    it('Should start listening to messages', () => {
      const message = {
        message: MessageTypes.HARVEST_TARGET_REQUEST
      };

      const harvesterController = require('../controller.harvester')();

      harvesterController.handleMessage(message);
    });

  });

  describe('#recommendedHarvestersForSourceAt(pos)', () => {

    it('Should return the number of empty spaces around the position plus 1', () => {
      const tiles = [
        { x:4, y:4, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },
        { x:5, y:4, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:6, y:4, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },

        { x:4, y:5, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },
        { x:5, y:5, type: ObjectTypes.SOURCE},
        { x:6, y:5, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },

        { x:4, y:6, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:5, y:6, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },
        { x:6, y:6, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },
      ];

      const room = {
        lookAtAreaByTypes: sinon.stub().returns(tiles),
      };
      const harvesterController = require('../controller.harvester')();
      const harvesterCount = harvesterController.recommendedHarvestersForSourceAt(room, 5, 5);

      expect(room.lookAtAreaByTypes.calledOnce).to.be.true;
      expect(room.lookAtAreaByTypes.calledWith(4, 4, 6, 6)).to.be.true;
      expect(harvesterCount).to.equal(6);
    });
  });

  // TODO: I've split this method up some more.
  // Need to create an internal class so I can test the interface properly
  describe('#findAvailableSourcesInRoom(roomName)', () => {

    it('Should find all the available sources in the room', () => {
      const sources = [
        { pos: {x:10, y:10}, id: "source1" },
        { pos: {x:20, y:20}, id: "source2" },
        { pos: {x:30, y:30}, id: "source3" },
      ];
      const enemyCreepsInArea = sinon.stub();
      enemyCreepsInArea.withArgs(5, 5, 15, 15).returns(false);
      enemyCreepsInArea.withArgs(15, 15, 25, 25).returns(true);
      enemyCreepsInArea.withArgs(25, 25, 35, 35).returns(false);
      const lookAtAreaByTypes = sinon.stub();
      lookAtAreaByTypes.withArgs(9,9,11,11,[ObjectTypes.TERRAIN]).returns([
        { x:9, y:9, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:10, y:9, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:11, y:9, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },

        { x:9, y:10, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },
        { x:11, y:10, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },

        { x:9, y:11, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:10, y:11, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:11, y:11, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL }
      ]);
      lookAtAreaByTypes.withArgs(29,29,31,31,[ObjectTypes.TERRAIN]).returns([
        { x:29, y:29, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:30, y:29, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:31, y:29, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },

        { x:29, y:30, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },
        { x:31, y:30, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.PLAIN },

        { x:29, y:31, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:30, y:31, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
        { x:31, y:31, type: ObjectTypes.TERRAIN, terrain: TerrainTypes.WALL },
      ]);
      const room = {
        energySources: sinon.stub().returns(sources),
        enemyCreepsInArea: enemyCreepsInArea,
        lookAtAreaByTypes: lookAtAreaByTypes
      };
      const worldData = {
        roomByName: sinon.stub().returns(room)
      };
      const harvesters = [
        { memory: { role: "harvester.basic.harvesting", target: "source1"} },
        { memory: { role: "harvester.basic.harvesting", target: "source1"} },
        { memory: { role: "harvester.basic.delivering" } },

        { memory: { role: "harvester.basic.harvesting", target: "source3"} },
        { memory: { role: "harvester.basic.harvesting", target: "source3"} },
        { memory: { role: "harvester.basic.harvesting", target: "source3"} }
      ];
      const creepData = {
        harvesters: sinon.stub().returns(harvesters)
      };
      const harvesterController = require('../controller.harvester')(undefined, worldData, creepData);

      const foundSources = harvesterController.findAvailableSourcesInRoom("sim");

      expect(worldData.roomByName.calledOnce).to.be.true;
      expect(worldData.roomByName.calledWith("sim")).to.be.true;
      expect(room.energySources.calledOnce).to.be.true;
      expect(room.enemyCreepsInArea.calledThrice).to.be.true;
      expect(room.enemyCreepsInArea.calledWith(5, 5, 15, 15)).to.be.true;
      expect(room.enemyCreepsInArea.calledWith(15, 15, 25, 25)).to.be.true;
      expect(room.enemyCreepsInArea.calledWith(25, 25, 35, 35)).to.be.true;

      expect(room.lookAtAreaByTypes.calledTwice).to.be.true;
      expect(room.lookAtAreaByTypes.calledWith(9, 9, 11, 11)).to.be.true;
      expect(room.lookAtAreaByTypes.calledWith(29, 29, 31, 31)).to.be.true;

      expect(creepData.harvesters.calledOnce).to.be.true;

      expect(foundSources).to.not.be.undefined;
      expect(foundSources).to.be.an.array;
      expect(foundSources).to.have.length(1);
    });

  });

});
