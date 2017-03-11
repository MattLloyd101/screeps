const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const messageBus = require('../messageBus')();

const PrioritiserFactory = require('../controller.prioritiser.js');

const bodyA = {};
const bodyB = {};
const bodyC = {};
const requestA = {
  type: 'spawn',
  unit: bodyA,
  priority: 1
};
const requestB = {
  type: 'spawn',
  unit: bodyB,
  priority: -1
};
const requestC = {
  type: 'spawn',
  unit: bodyC,
  priority: 5
};
const aStrategyMock = {
  spawnRequests: sinon.stub().returns([requestA])
};
const bStrategyMock = {
  spawnRequests: sinon.stub().returns([requestB])
};
const cStrategyMock = {
  spawnRequests: sinon.stub().returns([requestC])
};
const strategies = [aStrategyMock, bStrategyMock, cStrategyMock];
const spawnControllerMock = {
  spawn: sinon.spy()
};

describe('Prioritisation controller', () => {

	describe('#collateSpawns()', () => {

		it('Should return empty array when no strategy asks for anything', () => {
      const aStrategyMock = {
        spawnRequests: sinon.stub().returns([])
      };
      const bStrategyMock = {
        spawnRequests: sinon.stub().returns([])
      };
      const cStrategyMock = {
        spawnRequests: sinon.stub().returns([])
      };
      const strategies = [aStrategyMock, bStrategyMock, cStrategyMock];

      const spawnControllerMock = {
        spawn: sinon.spy()
      };
			const prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      const spawnRequests = prioritiser.collateSpawnRequests();

      expect(spawnRequests).to.have.members([]);

      expect(aStrategyMock.spawnRequests.calledOnce).to.be.true;
      expect(bStrategyMock.spawnRequests.calledOnce).to.be.true;
      expect(cStrategyMock.spawnRequests.calledOnce).to.be.true;
		});

    it('Should merge multiple strategies requests', () => {
      const prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      const spawnRequests = prioritiser.collateSpawnRequests();

      expect(spawnRequests).to.deep.have.members([bodyA, bodyB, bodyC]);
    });

    it('Should order the requested strategies by priority', () => {
      const prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      const spawnRequests = prioritiser.collateSpawnRequests();

      expect(spawnRequests[0]).to.equal(bodyC);
      expect(spawnRequests[1]).to.equal(bodyA);
      expect(spawnRequests[2]).to.equal(bodyB);
    });

	});

  describe('#performSpawns()', () => {

    it('Should not attempt to spawn if the Spawner is not ready', () => {
      const spawnControllerMock = {
        canSpawnCount: sinon.stub().returns(0),
        spawn: sinon.spy()
      };
      const prioritiser = PrioritiserFactory(strategies, spawnControllerMock, messageBus);

      prioritiser.performSpawns();

      expect(spawnControllerMock.spawn.called).to.be.false;
      expect(spawnControllerMock.canSpawnCount.calledOnce).to.be.true;
    });

  });
});

