const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const createGameSpy = (response) => ({
  getObjectById: sinon.stub().returns(response)
});

const createBehaviourSpy = () => ({
    askForHarvestTarget: sinon.spy(),
    askForDeliverTarget: sinon.spy(),
    harvest: sinon.spy(),
    deliver: sinon.spy(),
    removeTarget: sinon.spy()
});

const createHarvesterRole = (Game, behaviour) => {
  Game = Game || createGameSpy();
  behaviour = behaviour || createBehaviourSpy();
  return require('../role.harvester.basic')(Game, behaviour);
};

describe('Basic Harvester Role', () => {

	describe('#transition()', () => {

		it('Should transition from the root role to needsHarvestTarget', () => {
      const creep = {
        memory: {
          role: 'harvester.basic'
        }
      };

      const basicHarvesterRole = createHarvesterRole();
      const applied = basicHarvesterRole.transition(creep);

			expect(creep.memory.role).to.equal('harvester.basic.needsHarvestTarget');
      expect(applied).to.be.true;
		});

    it('Should not transition from needsHarvestTarget role to needsHarvestTarget', () => {
      const creep = {
        memory: {
          role: 'harvester.basic.needsHarvestTarget'
        }
      };

      const basicHarvesterRole = createHarvesterRole();
      const applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.needsHarvestTarget');
      expect(applied).to.be.false;
    });

    it('Should transition from needsHarvestTarget role to harvesting when we have a collect target', () => {
      const creep = {
        memory: {
          role: 'harvester.basic.needsHarvestTarget',
          target: 'id1'
        }
      };
      const Game = createGameSpy({
        pos: {
          x: 1,
          y: 1,
          roomName: ''
        }
      });
      const basicHarvesterRole = createHarvesterRole(Game);
      const applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.harvesting');
      expect(applied).to.be.true;
    });

    it('Should transition from harvesting role to needsDeliverTarget when we cannot collect anymore', () => {
      const creep = {
        carry: {
          energy: 50
        },
        carryCapacity: 50,
        memory: {
          role: 'harvester.basic.harvesting',
          target: 'id1'
        }
      };

      const behaviour = createBehaviourSpy();
      const basicHarvesterRole = createHarvesterRole(undefined, behaviour);
      const applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.needsDeliverTarget');
      expect(applied).to.be.true;
      expect(behaviour.removeTarget.calledOnce).to.be.true;
    });

    it('Should transition from needsDeliverTarget role to delivering when we have a deliver target', () => {
      const Game = createGameSpy({
        pos: {
          x: 1,
          y: 1,
          roomName: ''
        }
      });
      const creep = {
        memory: {
          role: 'harvester.basic.needsDeliverTarget',
          target: 'id1'
        }
      };

      const basicHarvesterRole = createHarvesterRole(Game);
      const applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.delivering');
      expect(applied).to.be.true;
    });


    it('Should transition from delivering role to needsHarvestTarget when we have delivered all of our energy', () => {
      const creep = {
        carry: {
          energy: 0
        },
        memory: {
          role: 'harvester.basic.delivering',
          target: 'id1'
        }
      };

      const behaviour = createBehaviourSpy();
      const basicHarvesterRole = createHarvesterRole(undefined, behaviour);
      const applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.needsHarvestTarget');
      expect(applied).to.be.true;
      expect(behaviour.removeTarget.calledOnce).to.be.true;
    });

	});

  describe('#run()', () => {

    it('Should call askForHarvestTarget when role state == needsHarvestTarget', () => {
      const creep = {
        memory: {
          role: 'harvester.basic.needsHarvestTarget',
        }
      };

      const behaviour = createBehaviourSpy();
      const basicHarvesterRole = createHarvesterRole(undefined, behaviour);

      basicHarvesterRole.run(creep);

      expect(behaviour.askForHarvestTarget.calledOnce).to.be.true;
      expect(behaviour.askForHarvestTarget.calledWith(creep)).to.be.true;
    });


    it('Should call harvest when role state == harvesting', () => {
      const creep = {
        memory: {
          role: 'harvester.basic.harvesting'
        }
      };
      const behaviour = createBehaviourSpy();
      const basicHarvesterRole = createHarvesterRole(undefined, behaviour);
      basicHarvesterRole.run(creep);

      expect(behaviour.harvest.calledOnce).to.be.true;
      expect(behaviour.harvest.calledWith(creep)).to.be.true;
    });

    it('Should call askForDeliverTarget when role state == needsDeliverTarget', () => {
      const creep = {
        memory: {
          role: 'harvester.basic.needsDeliverTarget'
        }
      };
      const behaviour = createBehaviourSpy();
      const basicHarvesterRole = createHarvesterRole(undefined, behaviour);
      basicHarvesterRole.run(creep);

      expect(behaviour.askForDeliverTarget.calledOnce).to.be.true;
      expect(behaviour.askForDeliverTarget.calledWith(creep)).to.be.true;
    });

    it('Should call deliver when role state == delivering', () => {
      const creep = {
        memory: {
          role: 'harvester.basic.delivering'
        }
      };
      const behaviour = createBehaviourSpy();
      const basicHarvesterRole = createHarvesterRole(undefined, behaviour);
      basicHarvesterRole.run(creep);

      expect(behaviour.deliver.calledOnce).to.be.true;
      expect(behaviour.deliver.calledWith(creep)).to.be.true;
    });

  });

});
