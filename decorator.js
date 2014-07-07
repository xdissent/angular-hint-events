angular.module('ngHintEvent',[])
  .config(['$provide',function($provide){
    $provide.decorator('ngClickDirective', function($delegate) {
      var original = $delegate[0].compile;
      var falseBinds = [];
      $delegate[0].compile = function(element, attrs, transclude) {
        var ngEventDirs = eeLib.getEventDirectives();
        for(var attr in attrs.$attr){
          //attr = eeLib.camelToDashes(attr);
          var boundFunc = attrs[attr];
          if(ngEventDirs[attr] && !isDefinedFunction(boundFunc)) { // if the attr is an ngEvent attr && if its bound function does NOT exsists
            var toPush = {element:element, attribute: attr, boundFunc: boundFunc};
            falseBinds.push(toPush); //keep track of element, attr, and function name
          }
        }
        return original(element, attrs, transclude);
      };
      //check if boundFUnction is anything
      return $delegate;
    })
  }]);