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
  eeLib.ngEventDirectives = eventDirHash;
  return eventDirHash;
};
eeLib.camelToDashes = function(str) {
  return str.replace(/([A-Z])/g, function($1){return '-'+$1.toLowerCase();});
};
eeLib.dashesToCamel = function(str) {
  return str.replace(/(-.)/g, function($1){return $1.charAt(1).toUpperCase();});
};
eeLib.formatResults = function(messages) {
  messages = eeLib.addSuggestions(messages);
  if(messages.length) {
    console.groupCollapsed('Angular Hint: Events');
    messages.forEach(function(obj) {
      var id = (obj.element[0].id) ? ' with id: #'+obj.element[0].id : '';
      var type = obj.element[0].nodeName;
      var suggestion = obj.match ? ' try "'+obj.match+'"': '';
      var message = 'Function "'+obj.boundFunc+'" called on '+type+' element'+id+' does not '+
      'exist in that scope'+suggestion+'.';
      console.groupCollapsed(message);
      console.log(obj.element[0]);
      console.log(obj.scope);
      console.groupEnd();
    });
    console.groupEnd();
  }
};
eeLib.delayDisplay = function(messages, $timeout) {
  $timeout.cancel(eeLib.currentPromises);
  eeLib.currentPromises = $timeout(function() {
    eeLib.formatResults(messages);
  }.bind(this),250)
};
eeLib.getFunctionNames = function(str) {
  var results = str.split(/[\+\-\/\|\<\>\^=&!%~]/g).map(function(x){
    if(isNaN(+x)) {
      if(x.match(/\w+\(.*\)$/)){
        return x.substring(0,x.indexOf('('));
      }
      return '';
    }
  }).filter(function(x){return x;});
  return results;
};
eeLib.getEventAttr = function(attrs) {
  for(var attr in attrs) {
    if(eeLib.ngEventDirectives[attr]) {
      return eeLib.dashesToCamel(attr);
    }
  }
};
eeLib.addSuggestions = function(messages) {
  messages.forEach(function(messageObj) {
    var props = eeLib.getValidProps(messageObj.scope);
    var suggestion = eeLib.getSuggestion(messageObj.boundFunc, props);
    messageObj['match'] = suggestion;
  });
  return messages;
}
eeLib.getValidProps = function(obj) {
  var props = [];
  for(var prop in obj) {
    if (prop.charAt(0) != '$' && typeof obj[prop] == 'function') {
      props.push(prop);
    }
  }
  return props;
}
eeLib.getSuggestion = function (original, props) {
  var min_levDist = Infinity, closestMatch = '';
  for(var i in props) {
    prop = props[i];
    if(Math.abs(original.length-prop.length) < 3) {
      var currentlevDist = eeLib.levenshteinDistance(original, prop);
      var closestMatch = (currentlevDist < min_levDist)? prop : closestMatch;
      var min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return closestMatch;
}
eeLib.levenshteinDistance = function(s, t) {
    if(typeof s !== 'string' || typeof t !== 'string') {
      throw new Error('Function must be passed two strings, given: '+typeof s+' and '+typeof t+'.');
    }
    var d = [];
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    for (var i = n; i >= 0; i--) d[i] = [];
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        for (var j = 1; j <= m; j++) {
            if (i == j && d[i][j] > 4) return n;
            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1;
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;
            if (b < mi) mi = b;
            if (c < mi) mi = c;
            d[i][j] = mi;
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }
    return d[n][m];
};
