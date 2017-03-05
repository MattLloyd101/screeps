var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');

describe('Basic Harvester Role', () => {

	describe('#transition()', () => {

		it('Should transition from the root role to needsHarvestTarget', () => {
      var creep = {
        memory: {
          role: 'harvester.basic'
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')();
      var applied = basicHarvesterRole.transition(creep);

			expect(creep.memory.role).to.equal('harvester.basic.needsHarvestTarget');
      expect(applied).to.be.true;
		});

    it('Should not transition from needsHarvestTarget role to needsHarvestTarget', () => {
      var Game = {
        getObjectById: sinon.stub().returns(null)
      };
      var creep = {
        memory: {
          role: 'harvester.basic.needsHarvestTarget'
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')(Game);
      var applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.needsHarvestTarget');
      expect(applied).to.be.false;
    });

    it('Should transition from needsHarvestTarget role to harvesting when we have a collect target', () => {
      var Game = {
        getObjectById: sinon.stub().returns({
          pos: {
            x: 1,
            y: 1,
            roomName: ''
          }
        })
      };
      var creep = {
        memory: {
          role: 'harvester.basic.needsHarvestTarget',
          target: 'id1'
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')(Game);
      var applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.harvesting');
      expect(applied).to.be.true;
    });

    it('Should transition from harvesting role to needsDeliverTarget when we cannot collect anymore', () => {
      var creep = {
        carry: {
          energy: 50
        },
        carryCapacity: 50,
        memory: {
          role: 'harvester.basic.harvesting',
          target: 'id1'
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')();
      var applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.needsDeliverTarget');
      expect(applied).to.be.true;
      expect(creep.memory.target).to.be.undefined;
    });

    it('Should transition from needsDeliverTarget role to delivering when we have a deliver target', () => {
      var Game = {
        getObjectById: sinon.stub().returns({
          pos: {
            x: 1,
            y: 1,
            roomName: ''
          }
        })
      };
      var creep = {
        memory: {
          role: 'harvester.basic.needsDeliverTarget',
          target: 'id1'
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')(Game);
      var applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.delivering');
      expect(applied).to.be.true;
    });


    it('Should transition from delivering role to needsHarvestTarget when we have delivered all of our energy', () => {
      var creep = {
        carry: {
          energy: 0
        },
        memory: {
          role: 'harvester.basic.delivering',
          target: 'id1'
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')();
      var applied = basicHarvesterRole.transition(creep);

      expect(creep.memory.role).to.equal('harvester.basic.needsHarvestTarget');
      expect(applied).to.be.true;
      expect(creep.memory.target).to.be.undefined;
    });

	});

  describe('#run()', () => {

    it('Should request a harvest target via the Bus when role is needsHarvestTarget', () => {
      var position = {
        roomName: 'room',
        x: 42,
        y: 43
      };
      var creep = {
        pos: position,
        memory: {
          role: 'harvester.basic.needsHarvestTarget',
        }
      };
      var bus = sinon.spy();

      var basicHarvesterRole = require('../role.harvester.basic')(null, bus);

      basicHarvesterRole.run(creep);

      expect(bus.calledOnce).to.be.true;
      var calledMessage = bus.getCalls()[0].args[0];
      expect(calledMessage.type).to.equal(Config.messageTypes.HARVEST_TARGET_REQUEST);
      expect(calledMessage.pos).to.equal(position);
      var newTarget = {};

      calledMessage.callback(newTarget);
      expect(creep.memory.target).to.equal(newTarget);
    });


    it('Should move towards the target when role is harvesting and not next to target.', () => {
      var Game = {
        getObjectById: sinon.stub().returns({
          pos: {
            x: 1,
            y: 1,
            roomName: ''
          }
        })
      };
      var position = {
        roomName: 'room',
        x: 42,
        y: 43
      };
      var target = 'id1';
      var creep = {
        harvest: sinon.stub().returns(Config.errorCodes.ERR_NOT_IN_RANGE),
        moveTo: sinon.spy(),
        pos: position,
        memory: {
          role: 'harvester.basic.harvesting',
          target: target
        }
      };

      var basicHarvesterRole = require('../role.harvester.basic')(Game);
      basicHarvesterRole.run(creep);

      expect(creep.harvest.calledOnce).to.be.true;
      expect(creep.moveTo.calledOnce).to.be.true;
    });

  });

});
