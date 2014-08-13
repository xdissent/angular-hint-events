'use strict';

module.exports = function getEventDirectives() {
  var list = 'click submit mouseenter mouseleave mousemove mousedown mouseover mouseup dblclick keyup keydown keypress blur focus submit cut copy paste'.split(' ');
  var eventDirHash = {};
  list.forEach(function(dirName) {
    dirName = 'ng'+dirName.charAt(0).toUpperCase()+dirName.substring(1);
    eventDirHash[dirName] = dirName;
  });
  return eventDirHash;
};
