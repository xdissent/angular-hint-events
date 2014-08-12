'use strict';

module.exports = function getEventDirectives() {
  var versionIndex = {
    '0.0': 8,
    '1.2': 10,
    '1.4': 11,
    '2.0': 17,
  };
  var list = 'click submit mouseenter mouseleave mousemove mousedown mouseover mouseup dblclick keyup keydown keypress blur focus submit cut copy paste'.split(' ');
  var eventDirHash = {};
  var minor = angular.version.minor;
  var dot = angular.version.dot;
  var version = angular.version.major === 1 ? ''+minor+dot : list.length()-1;
  for(var i = 0; i <= versionIndex[version]; i++){
    var name = list[i];
    name = 'ng'+name.charAt(0).toUpperCase()+name.substring(1);
    eventDirHash[name] = name;
  }
  return eventDirHash;
};
