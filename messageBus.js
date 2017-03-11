const _ = require('./lodash.poly');

module.exports = () => {
  const _listeners = [];
  const addListener = (fn, type) => {
    _listeners.push([type, fn]);
  };

  const bus = function (message) {
    const activeListeners = _.filter(_listeners, (tuple) => {
        return _.isUndefined(tuple[0]) || tuple[0] === message.type;
    });
    _.each(activeListeners, (tuple) => {
        const listener = tuple[1];
        listener(message)
    });
  };

  bus.addListener = addListener;

  return bus;
};
