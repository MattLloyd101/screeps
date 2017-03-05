var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');

var RoleControllerFactory = require('../controller.role.v1');

describe('Role Controller', () => {

  describe('#performRole()', () => {

  	it('Should run the BasicHarvester Role for harvester.basic', () => {
      var basicHarvesterRole = { transition: sinon.spy(), run: sinon.spy() };
      var roleDefinitions = { "harvester.basic": basicHarvesterRole };
      var creep = {
        memory: {
          role: "harvester.basic"
        }
      };

			var roleController = RoleControllerFactory(Config, roleDefinitions);

      roleController.performRoles([creep]);

      expect(basicHarvesterRole.transition.calledOnce).to.be.true;
      expect(basicHarvesterRole.run.calledOnce).to.be.true;
      sinon.assert.callOrder(basicHarvesterRole.transition, basicHarvesterRole.run);
  	});

    it('Should run the BasicHarvester Role for harvester.basic.someState', () => {
      var basicHarvesterRole = { transition: sinon.spy(), run: sinon.spy() };
      var roleDefinitions = { "harvester.basic": basicHarvesterRole };
      var creep = {
        memory: {
          role: "harvester.basic.someState"
        }
      };

      var roleController = RoleControllerFactory(Config, roleDefinitions);

      roleController.performRoles([creep]);

      expect(basicHarvesterRole.transition.calledOnce).to.be.true;
      expect(basicHarvesterRole.run.calledOnce).to.be.true;
      sinon.assert.callOrder(basicHarvesterRole.transition, basicHarvesterRole.run);
    });

    it('Should not error and not call the role if no definitions are defined for the role', () => {
      var basicHarvesterRole = { transition: sinon.spy(), run: sinon.spy() };
      var creep = {
        memory: {
          role: "harvester.basic.someState"
        }
      };

      var roleController = RoleControllerFactory(Config, []);

      roleController.performRole(creep);

      expect(basicHarvesterRole.transition.called).to.be.false;
      expect(basicHarvesterRole.run.called).to.be.false;
    });

  });

});
