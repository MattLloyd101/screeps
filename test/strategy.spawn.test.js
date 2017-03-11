const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');
const MessageBus = require('../MessageBus');

const RequestType = Config.requestTypes;

const SpawnStrategyFactory = require('../strategy.spawn.js');

describe('Spawn Strategy', () => {

	describe('#energyRequests()', () => {

		it('Should request energy for each spawner equal to the energy missing', () => {
      const filteredStructureByTypeSpy = sinon.stub();
      filteredStructureByTypeSpy.onCall(0).returns([{
        id: 'id1',
        room: {
          "energyAvailable": 50,
          "energyCapacityAvailable": 200
        }
      }]);
      filteredStructureByTypeSpy.onCall(1).returns([{
        id: 'id2',
        room: {
          "energyAvailable": 150,
          "energyCapacityAvailable": 200
        }
      }]);
      const worldData = {
        rooms: sinon.stub().returns([{name: 'room1'}, {name: 'room2'}]),
        filteredStructureByType: filteredStructureByTypeSpy
      };
      const messageBus = MessageBus();
			const spawnStrategy = SpawnStrategyFactory(Config, messageBus, worldData);

			const requests = spawnStrategy.energyRequests();

      expect(worldData.rooms.calledOnce).to.be.true;
      expect(filteredStructureByTypeSpy.calledTwice).to.be.true;
			expect(requests).to.have.length(2);

      let energyRequest = requests[0];
      let expectedEnergyRequest = {
        type: RequestType.ENERGY,
        target: 'id1',
        energy: 150,
        priority: 1
      };

			expect(energyRequest).to.deep.equal(expectedEnergyRequest);

      energyRequest = requests[1];
      expectedEnergyRequest = {
        type: RequestType.ENERGY,
        target: 'id2',
        energy: 50,
        priority: 1
      };

      expect(energyRequest).to.deep.equal(expectedEnergyRequest);
		});

	});

});
