
var expect = require('chai').expect;
var assert = require('chai').assert;
var Config = require('../config')();
var BodyTypes = Config.bodyTypes;
var RequestType = Config.requestTypes;

var HarvesterStrategyFactory = require('../strategy.harvester.v1');

describe('Harvester Strategy', () => {
	describe('#spawnRequests()', () => {
		it('Should request a new harvester when harvesters == 0 and GCL == 1', () => {
			var creeps = [];
			var gcl = 1
			var harvesterStrategy = HarvesterStrategyFactory();
			harvesterStrategy.init(creeps);

			var requests = harvesterStrategy.spawnRequests();

			 var basicHarvester = {
        body: [
          BodyTypes.WORK.val,
          BodyTypes.CARRY.val,
          BodyTypes.MOVE.val
        ]
      };

			assert.equal(requests.length, 1,
				"Expected spawnRequests to return one unit.");

			expect(requests[0]).to.deep.equal({ type: RequestType.SPAWN, unit: basicHarvester });
		});
	});
});
