const Unit = require("./../unit");

module.exports = {

  harvester: Unit({
    body: {
      WORK: 1,
      CARRY: 1,
      MOVE: 1
    },
    initialMemory: {
      role: "harvester.idle"
    },
    role: "harvester.idle"
  })
};