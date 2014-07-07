angular.module('demoApp',['ngRoute','ngHintEvent'])
  .config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
      controller: 'DemoController',
      controllerAs: 'demoCtrl',
      templateUrl: 'template.html'
    }).
    otherwise({redirectTo: '/'});
  }]);

angular.module('demoApp').controller('DemoController', ['$scope', function($scope) {
  $scope.name = 'Angular Hint: Events';
  $scope.count = 0;
  $scope.increment = function(){++$scope.count};
}]);