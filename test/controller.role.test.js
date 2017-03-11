const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');

const RoleControllerFactory = require('../controller.role.js');

describe('Role Controller', () => {

  describe('#performRole()', () => {

  	it('Should run the BasicHarvester Role for harvester.basic', () => {
      const basicHarvesterRole = {transition: sinon.spy(), run: sinon.spy()};
      const roleDefinitions = {"harvester.basic": basicHarvesterRole};
      const creep = {
        memory: {
          role: "harvester.basic"
        }
      };

			const roleController = RoleControllerFactory(Config, roleDefinitions);

      roleController.performRoles([creep]);

      expect(basicHarvesterRole.transition.calledOnce).to.be.true;
      expect(basicHarvesterRole.run.calledOnce).to.be.true;
      sinon.assert.callOrder(basicHarvesterRole.transition, basicHarvesterRole.run);
  	});

    it('Should run the BasicHarvester Role for harvester.basic.someState', () => {
      const basicHarvesterRole = {transition: sinon.spy(), run: sinon.spy()};
      const roleDefinitions = {"harvester.basic": basicHarvesterRole};
      const creep = {
        memory: {
          role: "harvester.basic.someState"
        }
      };

      const roleController = RoleControllerFactory(Config, roleDefinitions);

      roleController.performRoles([creep]);

      expect(basicHarvesterRole.transition.calledOnce).to.be.true;
      expect(basicHarvesterRole.run.calledOnce).to.be.true;
      sinon.assert.callOrder(basicHarvesterRole.transition, basicHarvesterRole.run);
    });

    it('Should not error and not call the role if no definitions are defined for the role', () => {
      const basicHarvesterRole = {transition: sinon.spy(), run: sinon.spy()};
      const creep = {
        memory: {
          role: "harvester.basic.someState"
        }
      };

      const roleController = RoleControllerFactory(Config, []);

      roleController.performRole(creep);

      expect(basicHarvesterRole.transition.called).to.be.false;
      expect(basicHarvesterRole.run.called).to.be.false;
    });

  });

});
