var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');

var Role = require('../role');

describe('Role helper', () => {

  describe('#decomposeRole(role)', () => {

      it('Should decompose a Role string into a role including master, sub and state', () => {
        var decomposedRole = Role.decomposeRole('master.sub.state');

        expect(decomposedRole).to.deep.equal({
          master: 'master',
          sub: 'sub',
          state: 'state'
        });
      });

      it('Should decompose a Role string into a role including master and sub', () => {
        var decomposedRole = Role.decomposeRole('master.sub');

        expect(decomposedRole).to.deep.equal({
          master: 'master',
          sub: 'sub'
        });
      });

  });

  describe('#composeRole(role, ignoreState)', () => {

    it('Should compose a role string including master, sub and state', () => {
      var role = {
        master: 'master',
        sub: 'sub',
        state: 'state'
      };

      var composedRole = Role.composeRole(role);

      expect(composedRole).to.equal('master.sub.state');
    });

    it('Should compose a role string including master and sub', () => {
      var role = {
        master: 'master',
        sub: 'sub'
      };

      var composedRole = Role.composeRole(role);

      expect(composedRole).to.equal('master.sub');
    });

    it('Should compose a role string including master and sub when only asked to compose type', () => {
      var role = {
        master: 'master',
        sub: 'sub',
        state: 'state'
      };

      var composedRole = Role.composeRole(role, true);

      expect(composedRole).to.equal('master.sub');
    });

  });

});
