'use strict';

var hintLog = angular.hint = require('angular-hint-log');
var ngEventDirectives = getEventDirectives();

angular.module('ngHintEvents',[])
  .config(['$provide',function($provide) {

    for(var directive in ngEventDirectives) {

      var dirName = ngEventDirectives[directive]+'Directive';

      $provide.decorator(dirName, ['$delegate', '$timeout', '$parse',
        function($delegate, $timeout, $parse) {

          var original = $delegate[0].compile, falseBinds = [], messages = [];

          $delegate[0].compile = function(element, attrs, transclude) {
            var eventAttrName = getEventAttribute(attrs.$attr);
            var fn = $parse(attrs[eventAttrName]);
            var messages = [];
            return function ngEventHandler(scope, element, attrs) {
              for(var attr in attrs.$attr) {
                var boundFuncs = getFunctionNames(attrs[attr]);
                boundFuncs.forEach(function(boundFn) {
                  if(ngEventDirectives[attr] && !scope[boundFn]) {
                    messages.push({
                      scope: scope,
                      element:element,
                      attrs: attrs,
                      boundFunc: boundFn
                    });
                  }
                });
              }
              element.on(eventAttrName.substring(2).toLowerCase(), function(event) {
                scope.$apply(function() {
                  fn(scope, {$event:event});
                });
              });
              formatResults(messages);
            };
          };
          return $delegate;
      }]);
    }
  }]);

function getEventDirectives() {
>>>>>>> d4f13ffd74733830f942dfa58451c9d8c6b71a84:hint-events.js
  var list = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ');
  var eventDirHash = {};
  list.map(function(x){
    var name = 'ng'+x.charAt(0).toUpperCase()+x.substring(1);
    eventDirHash[name]=name;
  });
  return eventDirHash;
};

function getEventAttribute(attrs) {
  for(var attr in attrs) {
    if(ngEventDirectives[attr]) {
      return attr;
    }
  }
};

function getFunctionNames(str) {
  var results = str.replace(/\s+/g,'').split(/[\+\-\/\|\<\>\^=&!%~]/g).map(function(x){
    if(isNaN(+x)) {
      if(x.match(/\w+\(.*\)$/)){
        return x.substring(0,x.indexOf('('));
      }
      return '';
    }
  }).filter(function(x){return x;});
  return results;
};

function formatResults(messages) {
  messages = addSuggestions(messages);
  if(messages.length) {
    messages.forEach(function(obj) {
      var id = (obj.element[0].id) ? ' with id: #'+obj.element[0].id : '';
      var type = obj.element[0].nodeName;
      var suggestion = obj.match ? ' Try "'+obj.match+'"': '';
      var message = 'Function "'+obj.boundFunc+'" called on '+type+' element'+id+' does not '+
      'exist in that scope.'+suggestion+'. Event directive found on ' + obj.element[0] + ' in ' +
      obj.scope + ' scope.';
      hintLog.logMessage(message);
    });
  }
};

function addSuggestions(messages) {
  messages.forEach(function(messageObj) {
    var props = getValidProps(messageObj.scope);
    var suggestion = getSuggestion(messageObj.boundFunc, props);
    messageObj['match'] = suggestion;
  });
  return messages;
}

function getValidProps(obj) {
  var props = [];
  for(var prop in obj) {
    if (prop.charAt(0) != '$' && typeof obj[prop] == 'function') {
      props.push(prop);
    }
  }
  return props;
};

function getSuggestion(original, props) {
  var min_levDist = Infinity, closestMatch = '';
  for(var i in props) {
    var prop = props[i];
    if(areSimilarEnough(original, prop)) {
      var currentlevDist = levenshteinDistance(original, prop);
      var closestMatch = (currentlevDist < min_levDist)? prop : closestMatch;
      var min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return closestMatch;
}

function areSimilarEnough(s,t) {
  var strMap = {}, similarities = 0, STRICTNESS = .66;
  if(Math.abs(s.length-t.length) > 3) {
    return false;
  }
  s.split('').forEach(function(x){strMap[x] = x;});
  for (var i = t.length - 1; i >= 0; i--) {
    similarities = strMap[t.charAt(i)] ? similarities + 1 : similarities;
  }
  return similarities >= t.length * STRICTNESS;
};

function levenshteinDistance(s, t) {
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
