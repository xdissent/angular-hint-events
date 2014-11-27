'use strict';

module.exports = function getValidProps(obj, type) {
  var props = [];
  type = type || 'function';
  for(var prop in obj) {
    if (prop.charAt(0) !== '$' && typeof obj[prop] === type) {
      props.push(prop);
    }
  }
  return props;
};
