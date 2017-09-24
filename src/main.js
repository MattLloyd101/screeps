const __ = require('./lodash.poly.js');

const RuleEngine = require('node-rules');
const Rules = require('./rules/rules');

const RoomFactory = require('./room/room');

const WorldData = require('./worldData')(Game, RoomFactory());
const CreepData = require('./creepData')(Game);

const Strategies = require('./strategies/all');

// GC / Cache clear
CreepData.clearCache();
WorldData.clearCache();

const [facts, rules] = __.unzip(__.map(WorldData.allSeenRooms(), (room) => {
  const strategies = Strategies(room);
  return [strategies.getFacts(), strategies.getRules()];
}));

const flatFacts = __.flatten(facts);
const flatRules = __.flatten(rules);

// TODO: The original version of the rules engine uses process.nextTick.
// This doesn't play well with screeps.
// I've instead inlined the content of the function call so things happen right away.
// This may cause subtle bugs but I was far too lazy to gather the funcs and run them afterwards.
// If things break or doesn't resolve rules correctly then this is probably why...
// NOTE: Looks like it's blowing up the stack when we do next(), so maybe fix that?
const R = new RuleEngine(flatRules);

const runFacts = (facts) => {
  __.each(facts, (fact) => {
    console.log('fact', JSON.stringify(fact, null, '\t'));

    R.execute(fact, (result) => {
      console.log("result", JSON.stringify(result, null, '\t'));


      runFacts(result.__dynamicFacts);
    });

  });
};

runFacts(flatFacts);
