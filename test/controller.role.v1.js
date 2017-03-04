
var expect = require('chai').expect;
var Config = require('../config')();
var Unit = require('../Unit');

var UnitTypes = Config.unitTypes;
var BodyTypes = Config.bodyTypes;
var RequestType = Config.requestTypes;

var HarvesterStrategyFactory = require('../strategy.harvester.v1');

describe('Harvester Strategy', () => {
	describe('#spawnRequests()', () => {
		it('Should request a new basic harvester when harvesters == 0', () => {
			var harvesterStrategy = HarvesterStrategyFactory(Config);

			var requests = harvesterStrategy.spawnRequests();

			expect(requests).to.have.length(1);

      var spawnRequest = requests[0];
      var expectedSpawnRequest = {
        type: RequestType.SPAWN,
        unit: UnitTypes.harvester.basic.create(),
        priority: 100
      };

			expect(spawnRequest).to.deep.equal(expectedSpawnRequest);
		});
	});
});
