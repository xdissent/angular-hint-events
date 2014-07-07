var eeLib = {
};
eeLib.getEventDirectives = function() {
  var list = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ');
  var eventDirHash = {};
  list.map(function(x){eventDirHash['ng-'+x]='ng-'+x;});
  return eventDirHash;
}
eeLib.camelToDashes = function(str) {
 return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}
