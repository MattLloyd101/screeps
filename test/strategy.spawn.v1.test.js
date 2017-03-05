var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');
var MessageBus = require('../MessageBus');

var UnitTypes = Config.unitTypes;
var RequestType = Config.requestTypes;

var SpawnStrategyFactory = require('../strategy.spawn.v1');

describe('Spawn Strategy', () => {

	describe('#energyRequests()', () => {

		it('Should request energy for each spawner equal to the energy missing', () => {
      var filteredStructureByTypeSpy = sinon.stub();
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
      var worldData = {
        rooms: sinon.stub().returns([{name: 'room1'}, {name: 'room2'}]),
        filteredStructureByType: filteredStructureByTypeSpy
      };
      var messageBus = MessageBus();
			var spawnStrategy = SpawnStrategyFactory(Config, messageBus, worldData);

			var requests = spawnStrategy.energyRequests();

      expect(worldData.rooms.calledOnce).to.be.true;
      expect(filteredStructureByTypeSpy.calledTwice).to.be.true;
			expect(requests).to.have.length(2);

      var energyRequest = requests[0];
      var expectedEnergyRequest = {
        type: RequestType.ENERGY,
        target: 'id1',
        energy: 150,
        priority: 1
      };

			expect(energyRequest).to.deep.equal(expectedEnergyRequest);

      var energyRequest = requests[1];
      var expectedEnergyRequest = {
        type: RequestType.ENERGY,
        target: 'id2',
        energy: 50,
        priority: 1
      };

      expect(energyRequest).to.deep.equal(expectedEnergyRequest);
		});

	});

});
