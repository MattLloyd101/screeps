var gcl = require('./config.gcl');
var bodyTypes = require('./config.bodyTypes');
var unitTypes = require('./config.units.v1');

var VERBOSE = 6;
var DEBUG = 5;
var INFO = 4;
var WARN = 3;
var ERROR = 2;
var CRITICAL = 1;
var OFF = 0;
var LOG_LEVEL = DEBUG;

module.exports = {
  IterationMax: 10,
  VERBOSE: LOG_LEVEL >= VERBOSE,
  DEBUG: LOG_LEVEL >= DEBUG,
  INFO: LOG_LEVEL >= INFO,
  WARN: LOG_LEVEL >= WARN,
  ERROR: LOG_LEVEL >= ERROR,
  CRITICAL: LOG_LEVEL >= CRITICAL,
	gcl: gcl,
	bodyTypes: bodyTypes,
	unitTypes: unitTypes,
	requestTypes: {
		SPAWN: 'spawn'
	},
  messageTypes: {
    HARVEST_TARGET_REQUEST: 'harvestTargetRequest'
  },
  errorCodes: {
    OK: 0,
    ERR_NOT_OWNER: -1,
    ERR_BUSY: -4,
    ERR_NOT_FOUND: -5,
    ERR_NOT_ENOUGH_RESOURCES: -6,
    ERR_INVALID_TARGET: -7,
    ERR_NOT_IN_RANGE: -9,
    ERR_NO_BODYPOART: -12
  },
  room: {
    TOP: 0,
    LEFT: 0,
    BOTTOM: 49,
    RIGHT: 49
  },
  objectTypes: {
    SOURCE: 'source'
  }
};
