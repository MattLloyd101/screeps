var assert = require('chai').assert;
var SpawnControllerFactory = require('../controller.spawn.v1');

describe('Spawn Controller', () => {
  describe('#init()', () => {
    it('should accept a list of rooms', () => {
      var spawnList = [];

      var spawnController = SpawnControllerFactory();
      spawnController.init(spawnList);
    });
  });
});
