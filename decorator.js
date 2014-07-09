angular.module('ngHintEvent',[])
  .config(['$provide',function($provide){
    var ngEventDirs = eeLib.getEventDirectives();
    for(var directive in ngEventDirs) {
      var dirName = ngEventDirs[directive]+'Directive';
      $provide.decorator(dirName, ['$delegate', '$timeout', '$parse',
        function($delegate, $timeout, $parse) {
          var original = $delegate[0].compile, falseBinds = [], messages = [];
          eeLib.delayDisplay(messages, $timeout);
          $delegate[0].compile = function(element, attrs, transclude) {
            var eventAttrName = eeLib.getEventAttr(attrs.$attr);
            var fn = $parse(attrs[eventAttrName]);
            return function ngEventHandler(scope, element, attrs) {
              for(var attr in attrs.$attr) {
                var boundFuncs = eeLib.getFunctionNames(attrs[attr]);
                boundFuncs.forEach(function(boundFn) {
                  if(ngEventDirs[attr] && !scope[boundFn]) {
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
            };
          };
          return $delegate;
      }]);
    }
  }]);