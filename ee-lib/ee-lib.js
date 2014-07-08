var eeLib = {
  ngEventDirectives: {},
  currentPromises: {}
};
eeLib.getEventDirectives = function() {
  var list = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ');
  var eventDirHash = {};
  list.map(function(x){
    var name = 'ng'+x.charAt(0).toUpperCase()+x.substring(1);
    eventDirHash[name]=name;
  });
  return eventDirHash;
}
eeLib.camelToDashes = function(str) {
 return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}
eeLib.formatResults = function(messages) {
  if(messages.length) {
    console.groupCollapsed('Angular Hint: Events');
    messages.forEach(function(obj) {
      var id = (obj.element[0].id) ? ' with id: #'+obj.element[0].id : '';
      var type = obj.element[0].nodeName;
      var message = 'Function "'+obj.boundFunc+'" called on '+type+' element'+id+' does not '+
      'exist in that scope.';
      console.groupCollapsed(message);
      console.log(obj.element[0]);
      console.log(obj.scope);
      console.groupEnd();
    });
    console.groupEnd();
  }
}
eeLib.delayDisplay = function(messages, $timeout) {
  $timeout.cancel(eeLib.currentPromises);
  eeLib.currentPromises = $timeout(function() {
    eeLib.formatResults(messages);
  }.bind(this),250)
}