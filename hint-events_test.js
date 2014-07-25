var hintLog = angular.hint;
describe('hintEvents', function() {
  var $rootScope, $compile;
  beforeEach(module('ngHintEvents'));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
  }));

  it('should log a message if the function to handle an ng-event is not found', function() {
    var html = "<button id='increment1' ng-click=\"increments()\" ng-src>Fake Increment</button>";
    var element = angular.element(html);
    $compile(element)($rootScope);
    $rootScope.$apply();
    expect(hintLog.flush().length).toBe(1);
  });


  it('should suggest a similar function to the not found ng-event function', function() {
    angular.module('sampleApp', []).controller('SampleController', ['$scope',
      function($scope) {
        $scope.name = 'Angular Hint: Events';
        $scope.count = 0;
        $scope.increment = function(){++$scope.count};
      }]);

    var html = "<button id='increment1' ng-click=\"increments()\" ng-src>Fake Increment</button>";
    var element = angular.element(html);
    $compile(element)($rootScope);
    $rootScope.$digest();
    expect(hintLog.flush()).toEqual([ 'Function "increments" called on BUTTON element with id: ' +
      '#increment1 does not exist in that scope. (Try "constructor") Event directive found on ' +
      '[object HTMLButtonElement] in [object Object] scope.' ]);
  });
});