var sinon = require('sinon');
var expect = require('chai').expect;
var UnitTypes = require('../config.units.v1');
var SpawnControllerFactory = require('../controller.spawn.v1');

var mockSpawner = (value) => {
  return {
    canCreateCreep: sinon.stub().returns(value),
    createCreep: sinon.stub().returns(value)
  };
}

var spawnerA = mockSpawner(-4);
var spawnerB = mockSpawner(-6);
var spawnerC = mockSpawner(-4);
var notReadySpawners = [spawnerA, spawnerB, spawnerC];

var spawnerD = mockSpawner(-4);
var spawnerE = mockSpawner(0);
var spawnerF = mockSpawner(0);
var readySpawners = [spawnerD, spawnerE, spawnerF];

var spawnController = SpawnControllerFactory();

describe('Spawn Controller', () => {

  describe('#canSpawnCount()', () => {

    it('returns 0 if all spawners cannot create a creep.', () => {
      spawnController.init(notReadySpawners);

      var canSpawnCount = spawnController.canSpawnCount();

      expect(canSpawnCount).to.be.equal(0);
      expect(spawnerA.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerB.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerC.canCreateCreep.calledOnce).to.be.true;
    });

    it('returns the number of spawners that can create a creep.', () => {
      spawnController.init(readySpawners);

      var canSpawnCount = spawnController.canSpawnCount();

      expect(canSpawnCount).to.be.equal(2);
      expect(spawnerD.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerE.canCreateCreep.calledOnce).to.be.true;
      expect(spawnerF.canCreateCreep.calledOnce).to.be.true;
    });

  });

  describe('#spawn()', () => {

    it('Does not call any spawner if none are ready.', () => {
      var unitArchetype = UnitTypes.harvester.basic;
      var unit = unitArchetype.create();
      spawnController.init(notReadySpawners);

      var returnValue = spawnController.spawn(unit);

      expect(returnValue).to.be.false;
      expect(spawnerA.createCreep.called).to.be.false;
      expect(spawnerB.createCreep.called).to.be.false;
      expect(spawnerC.createCreep.called).to.be.false;
    });

    it('Calls createCreep on a spawner that is ready.', () => {
      var unitArchetype = UnitTypes.harvester.basic;
      var unit = unitArchetype.create();
      spawnController.init(readySpawners);

      var returnValue = spawnController.spawn(unit);

      expect(returnValue).to.be.true;
      expect(spawnerD.createCreep.called).to.be.false;
      expect(spawnerE.createCreep.calledWith(unit.body, undefined, { role: unit.role }))
        .to.be.true;
      expect(spawnerF.createCreep.called).to.be.false;
    });


  });
});
