const Role = require('../role');
const Units = require('../config/units.js');

const mine = (creep) => creep._my;
const enemy = (creep) => !creep._my;
const harvester = (creep) => mine(creep) && Role.testMaster(Units.harvester.role);

module.exports = {
  mine,
  enemy,

  harvester
};
