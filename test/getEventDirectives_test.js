var getEventDirectives = require('../lib/getEventDirectives');

describe('getEventDirectives()', function() {
  it('should return a hash of Angular event directives', function() {
    var dirs = getEventDirectives();
    expect(dirs['ngClick']).toBe('ngClick');
    expect(dirs['ngMouseover']).toBe('ngMouseover');
  });


  it('should return a list specific to the angular version', function() {
    var dirs;

    angular.version.minor = 0;
    angular.version.dot = 0;
    dirs = getEventDirectives();
    expect(dirs['ngKeyup']).toBeUndefined();

    angular.version.minor = 1;
    angular.version.dot = 2;
    dirs = getEventDirectives();
    expect(dirs['ngKeypress']).toBeUndefined();

    angular.version.minor = 1;
    angular.version.dot = 4;
    dirs = getEventDirectives();
    expect(dirs['ngBlur']).toBeUndefined();

    angular.version.minor = 2;
    angular.version.dot = 0;
    dirs = getEventDirectives();
    expect(dirs['ngCut']).toBeDefined();

    angular.version.minor = 1;
    angular.version.dot = 3;
    expect(dirs['ngPaste']).toBeDefined();
  });
});