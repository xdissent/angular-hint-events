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
      var dirName = ngEventDirectives[directive] + 'Directive';

      $provide.decorator(dirName, ['$delegate', '$timeout', '$parse',
        function($delegate, $timeout, $parse) {
          $delegate[0].compile = function(element, attrs) {
            var eventAttrName = getEventAttribute(attrs.$attr),
              fn = $parse(attrs[eventAttrName]),
              messages = [];

            return function ngEventHandler(scope, element, attrs) {
              for(var attr in attrs.$attr) {
                var boundFuncs = getFunctionNames(attrs[attr]);

                //For the event functions that are bound, find if they exist on the scope
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
                  fn(scope, {$event: event});
                });
              });

              //Hint about any mistakes found
              formatResults(messages);
            };
          };
          return $delegate;
        }
      ]);
    }
  }]);