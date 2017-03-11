const _ = require('./lodash.poly');

// TODO: probably want something like a quadtree here instead.
// This will do for the moment but when we get more spatial lookups we should invest in a quadtree impl.

module.exports = (data) => {

  const key = (x, y) => x + ":" + y;

  const _index = _.foldl(data, (out, entry) => {
    const _key = key(entry.x, entry.y);
    if(_.isNil(out[_key])) out[_key] = [];

    out[_key].push(entry);
    return out;
  }, {});

  const keysForArea = (top, left, bottom, right) => {
    let out = [];
    for(let y = top; y <= bottom; y++) {
      for(let x = left; x <= right; x++) {
        out.push(key(x, y));
      }
    }
    return out;
  };

  const at = (x, y) => {
    const _key = key(x, y);
    return _index[_key];
  };

  const inside = (top, left, bottom, right) => {
    const _keys = keysForArea(top, left, bottom, right);
    return _.flatMap(_keys, (_key) => {
      // index is a sparse map so we have to filter out undefined.
      if(_index[_key] === undefined) return [];
      return _index[_key];
    });
  };

  return {
    key,
    keysForArea,
    index: _index,
    at,
    inside
  };
};
