const sinon = require('sinon');
const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require('chai').expect;

const MessageBusFactory = require('../messageBus');

describe('Message Bus', () => {

  it('Should isolate multiple message busses', () => {
    const listenerA = sinon.spy();
    const listenerB = sinon.spy();
    const messageBusA = MessageBusFactory();
    const messageBusB = MessageBusFactory();

    messageBusA.addListener(listenerA);
    messageBusB.addListener(listenerB);

    expect(listenerA.called).to.be.false;
    expect(listenerB.called).to.be.false;

    const message = {
      type: "myMessageType"
    };
    messageBusA(message);

    expect(listenerA.calledOnce).to.be.true;
    expect(listenerB.calledOnce).to.be.false;
    expect(listenerA.calledWith(message)).to.be.true;
  });

	describe('#addListener() and #apply()', () => {

		it('Should add a listener callback', () => {
      const listener = sinon.spy();
      const messageBus = MessageBusFactory();
      messageBus.addListener(listener);

      expect(listener.called).to.be.false;
      const message = {
        type: "myMessageType"
      };
      messageBus(message);

      expect(listener.calledOnce).to.be.true;
      expect(listener.calledWith(message)).to.be.true;
		});

    it('Should call multiple listeners in the order they were added', () => {
      const listenerA = sinon.spy();
      const listenerB = sinon.spy();
      const messageBus = MessageBusFactory();

      messageBus.addListener(listenerA);
      messageBus.addListener(listenerB);

      expect(listenerA.called).to.be.false;
      expect(listenerB.called).to.be.false;

      const message = {
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
      const listener = sinon.spy();
      const messageBus = MessageBusFactory();
      messageBus.addListener(listener, "myMessageType");

      expect(listener.called).to.be.false;
      let message = {
        type: "notMyMessageType"
      };
      messageBus(message);

      expect(listener.called).to.be.false;

      message = {
        type: "myMessageType"
      };
      messageBus(message);
      expect(listener.calledOnce).to.be.true;
      expect(listener.calledWith(message)).to.be.true;
    });

  });

});
