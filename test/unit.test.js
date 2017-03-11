const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');
const BodyTypes = Config.bodyTypes;

const UnitFactory = require('../unit');

describe('Unit', () => {
  describe('#create()', () => {
    it('Should transform the unit prototype into a creatable unit', () => {
      let unitPrototype = {
        body: {
          WORK: 1,
          CARRY: 1,
          MOVE: 1
        }
      };
      let unit = UnitFactory(unitPrototype);

      let creatableUnit = unit.create();

      let expectedUnit = {
        body: [
          BodyTypes.WORK.val,
          BodyTypes.CARRY.val,
          BodyTypes.MOVE.val
        ]
      };
      expect(creatableUnit).to.deep.equal(expectedUnit);

      // more complicated example
      unitPrototype = {
        body: {
          WORK: 5,
          CARRY: 2,
          MOVE: 3
        }
      };
      unit = UnitFactory(unitPrototype);

      creatableUnit = unit.create();

      expectedUnit = {
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
      let unitPrototype = {
        body: {
          WORK: 1,
          CARRY: 1,
          MOVE: 1
        }
      };
      let unit = UnitFactory(unitPrototype);

      let buildCost = unit.buildCost();

      let expedctedBuildCost = 200;
      expect(buildCost).to.equal(expedctedBuildCost);

      // more complicated example
      unitPrototype = {
        body: {
          WORK: 5,
          CARRY: 3,
          MOVE: 2
        }
      };
      unit = UnitFactory(unitPrototype);

      buildCost = unit.buildCost();

      expedctedBuildCost = 750;
      expect(buildCost).to.equal(expedctedBuildCost);
    });
  });
});

