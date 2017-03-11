const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const SpatialIndex = require('../spatialIndex');

describe('Room', () => {

  describe('#spatialIndexKey(entry)', () => {

    it('Should return a compound key', () => {
      const index = SpatialIndex();
      const key = index.key(42, 43);

      expect(key).to.equal("42:43");
    });

  });

  describe('#keysForArea(top, left, bottom, right)', () => {

    it('Should return a list of compound keys', () => {
      const index = SpatialIndex();
      const keys = index.keysForArea(1, 1, 3, 3);

      expect(keys).to.have.length(9);
      expect(keys).to.not.contain("0:0");
      expect(keys).to.not.contain("0:1");
      expect(keys).to.not.contain("0:2");
      expect(keys).to.not.contain("0:3");
      expect(keys).to.not.contain("0:4");

      expect(keys).to.not.contain("1:0");
      expect(keys).to.contain("1:1");
      expect(keys).to.contain("1:2");
      expect(keys).to.contain("1:3");
      expect(keys).to.not.contain("1:4");

      expect(keys).to.not.contain("2:0");
      expect(keys).to.contain("2:1");
      expect(keys).to.contain("2:2");
      expect(keys).to.contain("2:3");
      expect(keys).to.not.contain("2:4");

      expect(keys).to.not.contain("3:0");
      expect(keys).to.contain("3:1");
      expect(keys).to.contain("3:2");
      expect(keys).to.contain("3:3");
      expect(keys).to.not.contain("3:4");

      expect(keys).to.not.contain("4:0");
      expect(keys).to.not.contain("4:1");
      expect(keys).to.not.contain("4:2");
      expect(keys).to.not.contain("4:3");
      expect(keys).to.not.contain("4:4");
    });

  });

  describe('#at(x, y)', () => {

    it('Should return a list entries in an area', () => {
      const data = [
        {x: 1, y: 1, type: "A"},
        {x: 2, y: 2, type: "A"},
        {x: 3, y: 3, type: "A"},
        {x: 3, y: 3, type: "B"},
        {x: 4, y: 4, type: "A"},
        {x: 5, y: 5, type: "A"},
      ];
      const index = SpatialIndex(data);
      const atTwoTwo = index.at(2, 2);
      expect(atTwoTwo).to.be.array;
      expect(atTwoTwo).to.have.length(1);
      expect(atTwoTwo).to.contain(data[1]);

      const atThreeThree = index.at(3, 3);
      expect(atThreeThree).to.be.array;
      expect(atThreeThree).to.have.length(2);
      expect(atThreeThree).to.contain(data[2]);
      expect(atThreeThree).to.contain(data[3]);
    });

  });

  describe('#inside(top, left, bottom, right)', () => {

    it('Should return a list entries in an area', () => {
      const data = [
        {x: 1, y: 1, type: "A"},
        {x: 2, y: 2, type: "A"},
        {x: 3, y: 3, type: "A"},
        {x: 3, y: 3, type: "B"},
        {x: 4, y: 4, type: "A"},
        {x: 5, y: 5, type: "A"},
      ];
      const index = SpatialIndex(data);
      const area = index.inside(2, 2, 3, 3);

      expect(area).to.be.array;
      expect(area).to.have.length(3);
      expect(area).to.contain(data[1]);
      expect(area).to.contain(data[2]);
      expect(area).to.contain(data[3]);
    });

  });

});