const gcl = require('./gcl.js');
const bodyTypes = require('./bodyTypes.js');
const unitTypes = require('./units.js');

const VERBOSE = 6;
const DEBUG = 5;
const INFO = 4;
const WARN = 3;
const ERROR = 2;
const CRITICAL = 1;
//noinspection JSUnusedLocalSymbols
const OFF = 0;

const LOG_LEVEL = INFO;

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
    UNIT: 'unit',
		SPAWN: 'spawn',
    ENERGY: 'energy'
	},
  objectTypes: {
    SOURCE: 'source',
    MINERAL: 'mineral',
    STRUCTURE: 'structure',
    TERRAIN: 'terrain',
    CREEP: 'creep'
  },
  messageTypes: {
    HARVEST_TARGET_REQUEST: 'harvestTargetRequest',
    ENERGY_DELIVERY_TARGET_REQUEST: 'energyDeliveryTargetRequest',
  },
  structureTypes: {
    SPAWN: 'spawn',
    CONTROLLER: 'controller'
  },
  resourceType: {
    RESOURCE_ENERGY: 'energy'
  },
  terrainTypes: {
    WALL: 'wall',
    PLAIN: 'plain'
  },
  errorCodes: {
    OK: 0,
    ERR_NOT_OWNER: -1,
    ERR_BUSY: -4,
    ERR_NOT_FOUND: -5,
    ERR_NOT_ENOUGH_RESOURCES: -6,
    ERR_INVALID_TARGET: -7,
    ERR_NOT_IN_RANGE: -9,
    ERR_TIRED: -11,
    ERR_NO_BODYPART: -12
  },
  room: {
    TOP: 0,
    LEFT: 0,
    BOTTOM: 49,
    RIGHT: 49
  }
};
