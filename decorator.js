angular.module('ngHintEvent',[])
  .config(['$provide',function($provide){
    var ngEventDirs = eeLib.getEventDirectives();
    for(var directive in ngEventDirs) {
      var dirName = ngEventDirs[directive]+'Directive';
      $provide.decorator(dirName, ['$delegate', '$timeout',
        function($delegate, $timeout) {
          var original = $delegate[0].compile;
          var falseBinds = [];
          var messages = [];
          eeLib.delayDisplay(messages, $timeout);
          $delegate[0].compile = function(element, attrs, transclude) {
            return function ngEventHandler(scope, element, attrs) {
              var ngEventDirs = eeLib.getEventDirectives(), boundFunc;
              for(var attr in attrs.$attr) {
                boundFunc = attrs[attr].substring(0,attrs[attr].indexOf('('));
                if(ngEventDirs[attr] && !scope[boundFunc]) {
                  messages.push({
                    scope: scope,
                    element:element,
                    attrs: attrs,
                    boundFunc: boundFunc
                  });
                }
              }
              element.on(name.substring(2).toLowerCase(), function(event) {
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
