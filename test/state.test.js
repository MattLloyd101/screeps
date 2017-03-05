var sinon = require('sinon');
var expect = require('chai').expect;
var State = require('../state');

describe('State Machine', () => {
	describe('#ctor(name)', () => {
		it('Should have a name', () => {
			var createdState = State("stateName");

			expect(createdState.stateName).to.equal("stateName");
		});
	});

  describe('#addTransition(state)', () => {

    it('Should add a transition with an always true predicate', () => {
      var myState = State("myState");
      var anotherState = State("anotherState");

      myState.addTransition(anotherState);

      expect(myState.transitions).to.have.length(1);
    });

    it('Should not transition with a non matching role', () => {
      var myState = State("myState");
      var anotherState = State("anotherState");

      myState.addTransition(anotherState);

      var transition = myState.transitions[0];

      var myObject = {
        memory: {
          role: 'anotherRole'
        }
      };

      expect(transition.test(myObject)).to.be.false;
      var applied = transition.apply(myObject);
      expect(myObject.memory.role).to.equal("anotherRole");
      expect(applied).to.be.false;
    })

    it('Should add a transition with a predicate', () => {
      var myState = State("myState");
      var anotherState = State("anotherState");

      myState.addTransition(anotherState, (creep) => creep.memory.predicateData);

      var transition = myState.transitions[0];

      var myObject = {
        memory: {
          predicateData: true,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.true;
      var applied = transition.apply(myObject);
      expect(myObject.memory.role).to.equal("anotherState");
      expect(applied).to.be.true;

      var myObject = {
        memory: {
          predicateData: false,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.false;
      var applied = transition.apply(myObject);
      expect(myObject.memory.role).to.equal("myState");
      expect(applied).to.be.false;
    });


    it('Should add a transition with a predicate and transition acton', () => {
      var myState = State("myState");
      var anotherState = State("anotherState");

      var action = sinon.spy();
      myState.addTransition(anotherState, (creep) => creep.memory.predicateData, action);

      var transition = myState.transitions[0];

      var myObject = {
        memory: {
          predicateData: true,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.true;
      var applied = transition.apply(myObject);
      expect(action.calledOnce).to.be.true;
      expect(applied).to.be.true;

      var myObject = {
        memory: {
          predicateData: false,
          role: 'myState'
        }
      };

      expect(transition.test(myObject)).to.be.false;
      var applied = transition.apply(myObject);
      expect(action.calledOnce).to.be.true;
      expect(applied).to.be.false;
    });


  });

  describe('#transitions', () => {

    it('Should be an empty array when not adding any transitions.', () => {
      var myState = State("myState");

      expect(myState.transitions).to.have.length(0);
    });

    it('Should contain a Transition object with a test and apply method when a transition has been added.', () => {
      var myState = State("myState");
      var anotherState = State("anotherState");

      myState.addTransition(anotherState);

      var transition = myState.transitions[0];

      var myObject = {
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
