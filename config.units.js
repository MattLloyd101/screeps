const Unit = require("./unit");

module.exports = {
	harvester: {
	  masterRole: "harvester",
		basic: Unit({
      body: {
        WORK: 1,
        CARRY: 1,
        MOVE: 1
      },
      role: "harvester.basic"
		})
	}
};