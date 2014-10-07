# Angular Hint Events [![Build Status](https://travis-ci.org/angular/angular-hint-events.svg?branch=master)](https://travis-ci.org/angular/angular-hint-events) [![Code Climate](https://codeclimate.com/github/angular/angular-hint-events.png)](https://codeclimate.com/github/angular/angular-hint-events)

This hinting module is part of the overall tool [AngularHint](https://github.com/angular/angular-hint)
that aims to help you spend less time finding silent errors in your code and more time programming. Loading this module will provide warnings specific to AngularJS event directives.

See the [AngularHintEvents NPM Module](https://www.npmjs.org/package/angular-hint-events).

##Usage

Install the [AngularHint NPM module](https://www.npmjs.org/package/angular-hint)
and use `ng-hint` or `ng-hint-include='events'` to
enable AngularHintEvents. Further installation information is available on the
[main AngularHint repository](https://github.com/angular/angular-hint#usage).

##Features

####[Identifying Undefined Variables](identifying-undefined-variables)
AngularHintEvents checks all ngEventDirectives `ngClick`, `ngMousedown`, `ngFocus`, etc. and their attributes for defined functions and variables on the appropriate `$scope`. If a function or variable is found to be `undefined`, AngularHintEvents will notify you and suggest the closest match if one exists. In the first example below, you would be warned that the function `increments` doesn't exist for its scope and that you should try `increment`.

More complicated expressions will also be checked for values found to be `undefined`. The second example would cause a warning saying that `divideVal` and `divide` are not defined.

##### Example HTML Implementation
```html
<a ng-click="increments">Count!</a>
<a ng-click="divideVal = dividend() / divide()">Count!</a>
```

##### Example Controller Implementation:
```javascript
angular.module('demoApp').controller('DemoController', ['$scope', function($scope) {
  $scope.count = 0;
  $scope.divideValue;
  $scope.increment = function() {
    ++$scope.count
  };
  $scope.dividend = function() {
    return Math.random()*20+20
  };
  $scope.divisor = function() {
    return Math.random()*10+1
  };
}]);
```
##Contributing

Want to improve AngularHintEvents or other facets of AngularHint? We'd love to get your help! See the [Contributing Guidelines](https://github.com/angular/angular-hint/blob/master/CONTRIBUTING.md).

## [License](LICENSE)

Copyright 2014 Google, Inc. http://angularjs.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
