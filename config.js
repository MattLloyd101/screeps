var gcl = require('./config.gcl');

module.exports = () => {

	return {
		gcl: gcl,
		bodyTypes: {
			keys: [ "MOVE", "WORK", "CARRY", "ATTACK", "RANGED_ATTACK", "HEAL", "CLAIM", "TOUGH" ],
			MOVE: { val: 'move', buildCost: 50 },
			WORK: { val: 'work', buildCost: 100 },
			CARRY: { val: 'carry', buildCost: 50 },
			ATTACK: { val: 'attack', buildCost: 80 },
			RANGED_ATTACK: { val: 'ranged_attack', buildCost: 150 },
			HEAL: { val: 'heal', buildCost: 250 },
			CLAIM: { val: 'claim', buildCost: 600 },
			TOUGH: { val: 'tough', buildCost: 10 }
		},
		requestTypes: {
			SPAWN: 'spawn'
		}
	};
};
