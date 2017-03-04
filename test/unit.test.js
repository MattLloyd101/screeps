
var expect = require('chai').expect;
var Config = require('../config')();
var BodyTypes = Config.bodyTypes;
var RequestType = Config.requestTypes;

var UnitFactory = require('../unit');

describe('Unit', () => {
  describe('#create()', () => {
    it('Should transform the unit prototype into a creatable unit', () => {
      var unitPrototype = {
        body: {
          WORK: 1,
          CARRY: 1,
          MOVE: 1
        }
      };
      var unit = UnitFactory(unitPrototype);

      var creatableUnit = unit.create();

      var expectedUnit = {
        body: [
          BodyTypes.WORK.val,
          BodyTypes.CARRY.val,
          BodyTypes.MOVE.val
        ]
      };
      expect(creatableUnit).to.deep.equal(expectedUnit);
    });
  });

    describe('#create()', () => {
    it('Should transform the unit prototype into a creatable unit', () => {
      var unitPrototype = {
        body: {
          WORK: 5,
          CARRY: 2,
          MOVE: 3
        }
      };
      var unit = UnitFactory(unitPrototype);

      var creatableUnit = unit.create();

      var expectedUnit = {
        body: [
          BodyTypes.WORK.val,
          BodyTypes.WORK.val,
          BodyTypes.WORK.val,
          BodyTypes.WORK.val,
          BodyTypes.WORK.val,
          BodyTypes.CARRY.val,
          BodyTypes.CARRY.val,
          BodyTypes.MOVE.val,
          BodyTypes.MOVE.val,
          BodyTypes.MOVE.val
        ]
      };
      expect(creatableUnit).to.deep.equal(expectedUnit);
    });
  });

  describe('#buildCost()', () => {
    it('Should calculate the build cost from the prototype.', () => {
      var unitPrototype = {
        body: {
          WORK: 1,
          CARRY: 1,
          MOVE: 1
        }
      };
      var unit = UnitFactory(unitPrototype);

      var buildCost = unit.buildCost();

      var expedctedBuildCost = 200;
      expect(buildCost).to.equal(expedctedBuildCost);
    });
  });

  describe('#buildCost()', () => {
    it('Should calculate the build cost from the prototype.', () => {
      var unitPrototype = {
        body: {
          WORK: 5,
          CARRY: 3,
          MOVE: 2
        }
      };
      var unit = UnitFactory(unitPrototype);

      var buildCost = unit.buildCost();

      var expedctedBuildCost = 750;
      expect(buildCost).to.equal(expedctedBuildCost);
    });
  });
});

