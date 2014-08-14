'use strict';

/**
* Load necessary functions from /lib into variables.
*/
var ngEventDirectives = require('./lib/getEventDirectives')(),
  getEventAttribute = require('./lib/getEventAttribute'),
  getFunctionNames = require('./lib/getFunctionNames'),
  formatResults = require('./lib/formatResults');

/**
* Decorate $provide in order to examine ng-event directives
* and hint about their effective use.
*/
angular.module('ngHintEvents', [])
  .config(['$provide', function($provide) {

    for(var directive in ngEventDirectives) {
      var dirName = ngEventDirectives[directive]+'Directive';
      try{
        $provide.decorator(dirName, ['$delegate', '$timeout', '$parse',
          function($delegate, $timeout, $parse) {

            var original = $delegate[0].compile, falseBinds = [], messages = [];

            $delegate[0].compile = function(element, attrs, transclude) {
              var angularAttrs = attrs.$attr;
              var eventAttrName = getEventAttribute(angularAttrs);
              var fn = $parse(attrs[eventAttrName]);
              var messages = [];
              return function ngEventHandler(scope, element, attrs) {
                for(var attr in angularAttrs) {
                  var boundFuncs = getFunctionNames(attrs[attr]);
                  boundFuncs.forEach(function(boundFn) {
                    if(ngEventDirectives[attr] && !(boundFn in scope)) {
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
      } catch(e) {}
    }
  }]);