const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');

describe('Creep Data', () => {

  describe('#allCreeps()', () => {

    it('Should return a list of all creeps everywhere.', () => {
      const jim = {};
      const jon = {};
      const Game = {
        creeps: {
          'jim': jim,
          'jon': jon
        }
      };
      const creepData = require('../creepData')(Game);

      const creeps = creepData.allCreeps();

      expect(creeps).to.not.be.undefined;
      expect(creeps).to.have.length(2);
      expect(creeps[0]).to.equal(jim);
      expect(creeps[1]).to.equal(jon);
    });

  });

  describe('#harvesters()', () => {

    it('Should return a list of all harvesters everywhere.', () => {
      const harvester1 = { memory: { role: 'harvester.basic.delivering'} };
      const harvester2 = { memory: { role: 'harvester.basic.harvesting'} };
      const collector = { memory: { role: 'collector.basic.collecting'} };
      const Game = {
        creeps: {
          'harvester1': harvester1,
          'collector': collector,
          'harvester2': harvester2
        }
      };
      const creepData = require('../creepData')(Game);

      const creeps = creepData.harvesters();

      expect(creeps).to.not.be.undefined;
      expect(creeps).to.have.length(2);
      expect(creeps[0]).to.equal(harvester1);
      expect(creeps[1]).to.equal(harvester2);
    });

  });

});
