var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');
var MessageBus = require('../MessageBus');

var UnitTypes = Config.unitTypes;
var RequestType = Config.requestTypes;

var HarvesterStrategyFactory = require('../strategy.harvester.v1');

describe('Harvester Strategy', () => {

	describe('#spawnRequests()', () => {

		it('Should request a new basic harvester when harvesters == 0', () => {
      var messageBus = MessageBus();
			var harvesterStrategy = HarvesterStrategyFactory(Config, messageBus);

			var requests = harvesterStrategy.spawnRequests();

			expect(requests).to.have.length(1);

      var spawnRequest = requests[0];
      var expectedSpawnRequest = {
        type: RequestType.SPAWN,
        unit: UnitTypes.harvester.basic.create(),
        priority: 1
      };

			expect(spawnRequest).to.deep.equal(expectedSpawnRequest);
		});

	});

  it('Should respond to HarvesterTargetRequests with a target Source', () => {
    var sources = [
      {
        "x": 35,
        "y": 20,
        "type": "source",
        "source": {
          id: '1234'
        }
      },
      {
        "x": 23,
        "y": 25,
        "type": "source",
        "source": {
          id: '5678'
        }
      }
    ];
    var WorldData = {
      filteredRoomDataByType: sinon.stub().returns(sources)
    };
    var messageBus = MessageBus();
    var targetSource = {};
    var harvesterStrategy = HarvesterStrategyFactory(Config, messageBus, WorldData);

    var message = {
      type: Config.messageTypes.HARVEST_TARGET_REQUEST,
      pos: {
        roomName: 'sim',
        x: 5,
        y: 5
      },
      callback: sinon.spy()
    };
    messageBus(message);

    expect(WorldData.filteredRoomDataByType.calledOnce).to.be.true;
    expect(WorldData.filteredRoomDataByType.calledWith('sim')).to.be.true;
    expect(message.callback.calledOnce).to.be.true;
    expect(message.callback.calledWith(sources[0].source.id)).to.be.true;
  });

});
