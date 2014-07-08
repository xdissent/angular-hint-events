angular.module('ngHintEvent',[])
  .config(['$provide',function($provide){
    $provide.decorator('ngClickDirective', function($delegate) {
      var original = $delegate[0].compile;
      var falseBinds = [];
      $delegate[0].compile = function(element, attrs, transclude) {
        return function ngEventHandler(scope, element, attrs) {
          var ngEventDirs = eeLib.getEventDirectives(), boundFunc;
          for(var attr in attrs.$attr) {
            boundFunc = attrs[attr].substring(0,attrs[attr].indexOf('('));
            if(ngEventDirs[attr] && !scope[boundFunc]) {
              var id = (element[0].id) ? ' with id: #'+element[0].id : '';
              var type = element[0].nodeName;
              var message = 'Function "'+boundFunc+'" called on '+type+' element'+id+' does not '+
              'exist in that scope.';
              console.groupCollapsed(message);
              console.log(element[0]);
              console.log(scope);
              console.groupEnd();
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
    })
    var ngEventCheck = function() {
      eeLib.getEventDirectives().forEach(function(name) {
        eeLib.ngEventDirectives[name] = ['$parse', function($parse) {

        }]
      });
    }
  }]);
