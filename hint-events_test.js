var hintLog = angular.hint;
describe('hintEvents', function() {
  beforeEach(module('ngHintEvents'));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
  }));

  it('should warn if an event directive is not found', function() {
    angular.module('demoApp', []).controller('DemoController', ['$scope', function($scope) {
      $scope.name = 'Angular Hint: Events';
      $scope.count = 0;
      $scope.increment = function(){++$scope.count};
    }]);
    var html = "<button id='increment1' ng-click=\"increments()\" ng-src>Fake Increment</button>";
    var element = angular.element(html);
    $compile(element)($rootScope);
    $rootScope.$apply();
    expect(hintLog.flush().length).toBe(1);
  });
});