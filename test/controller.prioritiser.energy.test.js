const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const messageBus = require('../messageBus')();

const PrioritiserFactory = require('../controller.prioritiser.js');

const bodyA = {};
const bodyB = {};
const bodyC = {};
const requestA = {
  type: 'spawn',
  unit: bodyA,
  priority: 1
};
const requestB = {
  type: 'spawn',
  unit: bodyB,
  priority: -1
};
const requestC = {
  type: 'spawn',
  unit: bodyC,
  priority: 5
};
const aStrategyMock = {
  spawnRequests: sinon.stub().returns([requestA])
};
const bStrategyMock = {
  spawnRequests: sinon.stub().returns([requestB])
};
const cStrategyMock = {
  spawnRequests: sinon.stub().returns([requestC])
};
const strategies = [aStrategyMock, bStrategyMock, cStrategyMock];
const spawnControllerMock = {
  spawn: sinon.spy()
};

describe('Prioritisation Energy controller', () => {

  describe('#collateSpawns()', () => {

  });

});


