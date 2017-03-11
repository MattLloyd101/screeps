const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const UnitTypes = require('../config.units.js');
const SpawnControllerFactory = require('../controller.spawn.js');

const mockSpawner = (value) => {
  return {
    canCreateCreep: sinon.stub().returns(value),
    createCreep: sinon.stub().returns(value)
  };
};

const spawnerA = mockSpawner(-4);
const spawnerB = mockSpawner(-6);
const spawnerC = mockSpawner(-4);
const notReadySpawners = [spawnerA, spawnerB, spawnerC];

const spawnerD = mockSpawner(-4);
const spawnerE = mockSpawner(0);
const spawnerF = mockSpawner(0);
const readySpawners = [spawnerD, spawnerE, spawnerF];

const spawnController = SpawnControllerFactory();

describe('Spawn Controller', () => {

  describe('#canSpawnCount()', () => {

    it('returns 0 if all spawners cannot create a creep.', () => {
      spawnController.init(notReadySpawners);

      const canSpawnCount = spawnController.canSpawnCount();

      expect(canSpawnCount).to.be.equal(0);
      expect(spawnerA.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerB.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerC.canCreateCreep.calledOnce).to.be.true;
    });

    it('returns the number of spawners that can create a creep.', () => {
      spawnController.init(readySpawners);

      const canSpawnCount = spawnController.canSpawnCount();

      expect(canSpawnCount).to.be.equal(2);
      expect(spawnerD.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerE.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerF.canCreateCreep.calledOnce).to.be.true;
    });

  });

  describe('#spawn()', () => {

    it('Does not call any spawner if none are ready.', () => {
      const unitArchetype = UnitTypes.harvester.basic;
      const unit = unitArchetype.create();
      spawnController.init(notReadySpawners);

      const returnValue = spawnController.spawn(unit);

      expect(returnValue).to.be.false;
      expect(spawnerA.createCreep.called).to.be.false;
      expect(spawnerB.createCreep.called).to.be.false;
      expect(spawnerC.createCreep.called).to.be.false;
    });

    it('Calls createCreep on a spawner that is ready.', () => {
      const unitArchetype = UnitTypes.harvester.basic;
      const unit = unitArchetype.create();
      spawnController.init(readySpawners);

      const returnValue = spawnController.spawn(unit);

      expect(returnValue).to.be.true;
      expect(spawnerD.createCreep.called).to.be.false;
      expect(spawnerE.createCreep.calledWith(unit.body, undefined, { role: unit.role }))
        .to.be.true;
      expect(spawnerF.createCreep.called).to.be.false;
    });

  });
});
