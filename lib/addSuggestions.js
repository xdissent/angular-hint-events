var getValidProps = require('./getValidProps');
var suggest = require('suggest-it');


module.exports = function addSuggestions(messages) {
  messages.forEach(function(messageObj) {
    var dictionary = getValidProps(messageObj.scope);
    var suggestion = suggest(dictionary)(messageObj.boundFunc);
    messageObj['match'] = suggestion;
  });
  return messages;
};
