'use strict';

var getValidProps = require('./getValidProps'),
  suggest = require('suggest-it');

module.exports = function addSuggestions(messages) {
  messages.forEach(function(messageObj) {
    var obj = messageObj.scope;
    var props = messageObj.boundFunc.split('.');
    var matches = [];
    for (var propIndex = 0; propIndex < props.length; propIndex++) {
      var prop = props[propIndex];
      var isLast = propIndex === props.length - 1;
      if (obj && prop in obj) {
        matches.push(prop);
        obj = obj[prop];
        continue;
      }
      var type = isLast ? 'function' : 'object',
        dictionary = getValidProps(obj, type),
        suggestion = suggest(dictionary)(prop);
      if (!suggestion) {
        matches.length = 0;
        break;
      }
      matches.push(suggestion);
      obj = obj[suggestion];
    };
    messageObj['match'] = matches.join('.');
  });
  return messages;
};
