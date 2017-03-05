var _ = require('./lodash.poly');

module.exports = () => {
  var _listeners = [];
  var addListener = (fn, type) => {
    _listeners.push([type, fn]);
  };

  var bus = function(message) {
    var activeListeners = _.filter(_listeners, (tuple) => {
      return _.isUndefined(tuple[0]) || tuple[0] === message.type;
    });
    _.each(activeListeners, (tuple) => {
      var listener = tuple[1];
      listener(message)
    });
  };

  bus.addListener = addListener;

  return bus;
}
