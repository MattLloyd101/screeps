const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Role = require('../role');

describe('Role helper', () => {

  describe('#decomposeRole(role)', () => {

      it('Should decompose a Role string into a role including master, sub and state', () => {
        const decomposedRole = Role.decomposeRole('master.sub.state');

        expect(decomposedRole).to.deep.equal({
          master: 'master',
          sub: 'sub',
          state: 'state'
        });
      });

      it('Should decompose a Role string into a role including master and sub', () => {
        const decomposedRole = Role.decomposeRole('master.sub');

        expect(decomposedRole).to.deep.equal({
          master: 'master',
          sub: 'sub'
        });
      });

  });

  describe('#composeRole(role, ignoreState)', () => {

    it('Should compose a role string including master, sub and state', () => {
      const role = {
        master: 'master',
        sub: 'sub',
        state: 'state'
      };

      const composedRole = Role.composeRole(role);

      expect(composedRole).to.equal('master.sub.state');
    });

    it('Should compose a role string including master and sub', () => {
      const role = {
        master: 'master',
        sub: 'sub'
      };

      const composedRole = Role.composeRole(role);

      expect(composedRole).to.equal('master.sub');
    });

    it('Should compose a role string including master and sub when only asked to compose type', () => {
      const role = {
        master: 'master',
        sub: 'sub',
        state: 'state'
      };

      const composedRole = Role.composeRole(role, true);

      expect(composedRole).to.equal('master.sub');
    });

  });

  describe('#getMaster(role)', () => {

    it('Should return the master role', () => {
      let master = Role.getMaster('master.sub.state');

      expect(master).to.equal('master');

      master = Role.getMaster('master.sub');
      expect(master).to.equal('master');
    });

  });

  describe('#getSub(role)', () => {

    it('Should return the sub role', () => {
      let sub = Role.getSub('master.sub.state');

      expect(sub).to.equal('sub');

      sub = Role.getSub('master.sub');
      expect(sub).to.equal('sub');
    });

  });

  describe('#getState(role)', () => {

    it('Should return the state', () => {
      let state = Role.getState('master.sub.state');

      expect(state).to.equal('state');

      state = Role.getState('master.sub');
      expect(state).to.be.undefined;
    });

  });

  describe('#testMaster(master)', () => {

    it('Should return a tester function to test creeps', () => {
      const masterTester = Role.testMaster('master');

      expect(masterTester).to.be.a.function;

      let creep = { memory: {} };
      let result = masterTester(creep);
      expect(result).to.be.false;

      creep = { memory: { role: 'master.sub.state'} };
      result = masterTester(creep);
      expect(result).to.be.true;

      creep = { memory: { role: 'master2.sub.state'} };
      result = masterTester(creep);
      expect(result).to.be.false;
    });

  });


});
