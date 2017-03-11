const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const State = require('../state');

describe('State Machine', () => {
	describe('#ctor(name)', () => {
		it('Should have a name', () => {
			const createdState = State("stateName");

			expect(createdState.stateName).to.equal("stateName");
		});
	});

  describe('#addTransition(state)', () => {

    it('Should add a transition with an always true predicate', () => {
      const myState = State("myState");
      const anotherState = State("anotherState");

      myState.addTransition(anotherState);

      expect(myState.transitions).to.have.length(1);
    });

    it('Should not transition with a non matching role', () => {
      const myState = State("myState");
      const anotherState = State("anotherState");

      myState.addTransition(anotherState);

      const transition = myState.transitions[0];

      const myObject = {
        memory: {
          role: 'anotherRole'
        }
      };

      expect(transition.test(myObject)).to.be.false;
      const applied = transition.apply(myObject);
      expect(myObject.memory.role).to.equal("anotherRole");
      expect(applied).to.be.false;
    });

    it('Should add a transition with a predicate', () => {
      const myState = State("myState");
      const anotherState = State("anotherState");

      myState.addTransition(anotherState, (creep) => creep.memory.predicateData);

      const transition = myState.transitions[0];

      let myObject = {
        memory: {
          predicateData: true,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.true;
      let applied = transition.apply(myObject);
      expect(myObject.memory.role).to.equal("anotherState");
      expect(applied).to.be.true;

      myObject = {
        memory: {
          predicateData: false,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.false;
      applied = transition.apply(myObject);
      expect(myObject.memory.role).to.equal("myState");
      expect(applied).to.be.false;
    });


    it('Should add a transition with a predicate and transition acton', () => {
      const myState = State("myState");
      const anotherState = State("anotherState");

      const action = sinon.spy();
      myState.addTransition(anotherState, (creep) => creep.memory.predicateData, action);

      const transition = myState.transitions[0];

      let myObject = {
        memory: {
          predicateData: true,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.true;
      let applied = transition.apply(myObject);
      expect(action.calledOnce).to.be.true;
      expect(applied).to.be.true;

      myObject = {
        memory: {
          predicateData: false,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.false;
      applied = transition.apply(myObject);
      expect(action.calledOnce).to.be.true;
      expect(applied).to.be.false;
    });


  });

  describe('#transitions', () => {

    it('Should be an empty array when not adding any transitions.', () => {
      const myState = State("myState");

      expect(myState.transitions).to.have.length(0);
    });

    it('Should contain a Transition object with a test and apply method when a transition has been added.', () => {
      const myState = State("myState");
      const anotherState = State("anotherState");

      myState.addTransition(anotherState);

      const transition = myState.transitions[0];

      const myObject = {
        memory: {
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.true;
      transition.apply(myObject);
      expect(myObject.memory.role).to.equal("anotherState");
    });

  });
});
