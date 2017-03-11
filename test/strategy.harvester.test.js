const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const Config = require('../config');
const MessageBus = require('../MessageBus');

const UnitTypes = Config.unitTypes;
const RequestType = Config.requestTypes;

const HarvesterStrategyFactory = require('../strategy.harvester.js');

describe('Harvester Strategy', () => {

	describe('#spawnRequests()', () => {

		it('Should request a new basic harvester when harvesters == 0', () => {
      const messageBus = MessageBus();
			const harvesterStrategy = HarvesterStrategyFactory(Config, messageBus);

			const requests = harvesterStrategy.spawnRequests();

			expect(requests).to.have.length(1);

      const spawnRequest = requests[0];
      const expectedSpawnRequest = {
        type: RequestType.SPAWN,
        unit: UnitTypes.harvester.basic.create(),
        priority: 1
      };

			expect(spawnRequest).to.deep.equal(expectedSpawnRequest);
		});

	});

  it('Should respond to HarvesterTargetRequests with a target Source', () => {
    const sources = [
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
    const WorldData = {
      filteredRoomDataByType: sinon.stub().returns(sources)
    };
    const messageBus = MessageBus();
    const message = {
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
