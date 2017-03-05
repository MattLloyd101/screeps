var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');
var messageBus = require('../messageBus')();
var BodyTypes = Config.bodyTypes;
var RequestType = Config.requestTypes;

var PrioritiserFactory = require('../controller.prioritiser.v1');

var bodyA = {};
var bodyB = {};
var bodyC = {};
var requestA = {
  type: 'spawn',
  unit: bodyA,
  priority: 1
};
var requestB = {
  type: 'spawn',
  unit: bodyB,
  priority: -1
};
var requestC = {
  type: 'spawn',
  unit: bodyC,
  priority: 5
};
var aStrategyMock = {
  spawnRequests: sinon.stub().returns([requestA])
};
var bStrategyMock = {
  spawnRequests: sinon.stub().returns([requestB])
};
var cStrategyMock = {
  spawnRequests: sinon.stub().returns([requestC])
};
var strategies = [aStrategyMock, bStrategyMock, cStrategyMock];
var spawnControllerMock = {
  spawn: sinon.spy()
};

describe('Prioritisation controller', () => {

	describe('#collateSpawns()', () => {

		it('Should return empty array when no strategy asks for anything', () => {
      var aStrategyMock = {
        spawnRequests: sinon.stub().returns([])
      };
      var bStrategyMock = {
        spawnRequests: sinon.stub().returns([])
      };
      var cStrategyMock = {
        spawnRequests: sinon.stub().returns([])
      };
      var strategies = [aStrategyMock, bStrategyMock, cStrategyMock];

      var spawnControllerMock = {
        spawn: sinon.spy()
      };
			var prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      var spawnRequests = prioritiser.collateSpawnRequests();

      expect(spawnRequests).to.have.members([]);
      expect(aStrategyMock.spawnRequests.calledOnce).to.be.true;
      expect(bStrategyMock.spawnRequests.calledOnce).to.be.true;
      expect(cStrategyMock.spawnRequests.calledOnce).to.be.true;
		});

    it('Should merge multiple strategies requests', () => {
      var prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      var spawnRequests = prioritiser.collateSpawnRequests();

      expect(spawnRequests).to.deep.have.members([bodyA, bodyB, bodyC]);
    });

    it('Should order the requested strategies by priority', () => {
      var prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      var spawnRequests = prioritiser.collateSpawnRequests();

      expect(spawnRequests[0]).to.equal(bodyC);
      expect(spawnRequests[1]).to.equal(bodyA);
      expect(spawnRequests[2]).to.equal(bodyB);
    });

	});

  describe('#performSpawns()', () => {

    it('Should not attempt to spawn if the Spawner is not ready', () => {
      var spawnControllerMock = {
        canSpawnCount: sinon.stub().returns(0),
        spawn: sinon.spy()
      };
      var prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      prioritiser.performSpawns();

      expect(spawnControllerMock.spawn.called).to.be.false;
      expect(spawnControllerMock.canSpawnCount.calledOnce).to.be.true;
    });

  });
});

