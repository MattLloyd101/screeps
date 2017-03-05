var sinon = require('sinon');
var expect = require('chai').expect;
var Config = require('../config');

var MessageBusFactory = require('../messageBus');

describe('Message Bus', () => {

  it('Should isolate multiple message busses', () => {
    var listenerA = sinon.spy();
    var listenerB = sinon.spy();
    var messageBusA = MessageBusFactory();
    var messageBusB = MessageBusFactory();

    messageBusA.addListener(listenerA);
    messageBusB.addListener(listenerB);

    expect(listenerA.called).to.be.false;
    expect(listenerB.called).to.be.false;

    var message = {
      type: "myMessageType"
    };
    messageBusA(message);

    expect(listenerA.calledOnce).to.be.true;
    expect(listenerB.calledOnce).to.be.false;
    expect(listenerA.calledWith(message)).to.be.true;
  });

	describe('#addListener() and #apply()', () => {

		it('Should add a listener callback', () => {
      var listener = sinon.spy();
      var messageBus = MessageBusFactory();
      messageBus.addListener(listener);

      expect(listener.called).to.be.false;
      var message = {
        type: "myMessageType"
      };
      messageBus(message);

      expect(listener.calledOnce).to.be.true;
      expect(listener.calledWith(message)).to.be.true;
		});

    it('Should call multiple listeners in the order they were added', () => {
      var listenerA = sinon.spy();
      var listenerB = sinon.spy();
      var messageBus = MessageBusFactory();

      messageBus.addListener(listenerA);
      messageBus.addListener(listenerB);

      expect(listenerA.called).to.be.false;
      expect(listenerB.called).to.be.false;

      var message = {
        type: "myMessageType"
      };
      messageBus(message);

      expect(listenerA.calledOnce).to.be.true;
      expect(listenerB.calledOnce).to.be.true;
      expect(listenerA.calledWith(message)).to.be.true;
      expect(listenerB.calledWith(message)).to.be.true;
      expect(sinon.assert.callOrder(listenerA, listenerB));
    });

    it('Should be able to only listen to certain message types', () => {
      var listener = sinon.spy();
      var messageBus = MessageBusFactory();
      messageBus.addListener(listener, "myMessageType");

      expect(listener.called).to.be.false;
      var message = {
        type: "notMyMessageType"
      };
      messageBus(message);

      expect(listener.called).to.be.false;

      var message = {
        type: "myMessageType"
      };
      messageBus(message);
      expect(listener.calledOnce).to.be.true;
      expect(listener.calledWith(message)).to.be.true;
    });

  });

});
