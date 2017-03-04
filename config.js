var gcl = require('./config.gcl');
var bodyTypes = require('./config.bodyTypes');
var unitTypes = require('./config.units.v1');

module.exports = () => {

	return {
		gcl: gcl,
		bodyTypes: bodyTypes,
		unitTypes: unitTypes,
		requestTypes: {
			SPAWN: 'spawn'
		}
	};
};
