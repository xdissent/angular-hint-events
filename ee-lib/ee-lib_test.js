describe('eeLib', function() {
  describe('getEventDirectives()', function() {
    it('should return a hash of Angular event directives', function() {
      var dirs = eeLib.getEventDirectives()
      expect(dirs['ngClick']).toBe('ngClick');
      expect(dirs['ngMouseover']).toBe('ngMouseover');
    })
  })
  describe('dashesToCamel()', function() {
    it('should return a dash cased string to camel case', function() {
      var res = eeLib.dashesToCamel('this-is-a-test')
      expect(res).toBe('thisIsATest');
    })
  })
  describe('getFunctionNames()', function() {
    it('should return an array of strings with the function names with in an expression', function() {
      var simple = eeLib.getFunctionNames('simpleTest()');
      expect(simple[0]).toBe('simpleTest');

      var simple2 = eeLib.getFunctionNames('4 + simpleTest()');
      expect(simple2[0]).toBe('simpleTest');

      var twoFunctions = eeLib.getFunctionNames('one() / two()');
      expect(twoFunctions).toEqual(['one','two']);

      var paramFn = eeLib.getFunctionNames('one("test") / two([1,3,4])/three()');
      expect(paramFn).toEqual(['one','two','three']);
    })
  })
  describe('getEventAttr()', function() {
    it('should return a string name of an ngEventDirective in camel case', function() {
      var res = eeLib.getEventAttr({'id':'id', 'ngClick':'ngClick', 'width':'width'})
      expect(res).toBe('ngClick');
    })
  })
  describe('getSuggestion()', function() {
    it('should return a string that is the closest match to the passed string in the array', function() {
      var res = eeLib.getSuggestion('incremnts',['increment', 'count','constructor']);
      expect(res).toBe('increment');
    })
  })
  describe('getValidProps()', function() {
    it('should return an array of valid function and property names on the scope to check', function() {
      var res = eeLib.getValidProps({
        $$childTail: null,
        $$watchers: [],
        increment: function(){},
        count: 0
      });
      expect(res[0]).toBe('increment');
    })
  })
  describe('addSuggestions()', function() {
    it('should return an array of objects with the suggestion as added properties for each object', function() {
      var scope = {
        $$childTail: null,
        $$watchers: [],
        incrementCount: function(){},
        count: 0
      };
      var messages = [{boundFunc: 'incrementConts', scope: scope}];
      var res = eeLib.addSuggestions(messages);
      var expected = messages;
      expected['match'] = 'incrementCount';
      expect(res).toEqual(expected);
    })
  })
  describe('areSimilarEnough()', function() {
    it('should return whether a passed string is close enough to another passed string', function() {
      var res = eeLib.areSimilarEnough('tests','tsts'); //first string longer
      expect(res).toBe(true);

      res = eeLib.areSimilarEnough('tsts','test'); //second string longer
      expect(res).toBe(true);

      res = eeLib.areSimilarEnough('asdf','tstd'); // half letters matched
      expect(res).toBe(false);

      res = eeLib.areSimilarEnough('wayTooLongOfADifference','yeahNotClose'); // string length difference > 2
      expect(res).toBe(false);
    })
  })
  describe('levenshteinDistance()', function() {
    it('should only accept strings to be passed',function() {
      expect(function() {
        eeLib.levenshteinDistance(null,null);
      }).toThrow('Function must be passed two strings, given: object and object.');
      expect(function() {
        eeLib.levenshteinDistance(2,6);
      }).toThrow('Function must be passed two strings, given: number and number.');
      expect(function() {
        eeLib.levenshteinDistance(undefined,undefined);
      }).toThrow('Function must be passed two strings, given: undefined and undefined.');
    })
    it('should return the proper levenshtein distance between two strings', function() {
      var test1 = eeLib.levenshteinDistance("nf-ap","ng-app");
      var test2 = eeLib.levenshteinDistance("","");
      var bound1 = eeLib.levenshteinDistance('ng-onmouseo','ng-onmouseover');
      var bound2 = eeLib.levenshteinDistance('asdf','qwertyuiop');
      var bound3 = eeLib.levenshteinDistance('ng-href','ng-href');
      expect(test1).toBe(2)
      expect(test2).toBe(0)
      expect(bound1).toBe(3)
      expect(bound2).toBe(10)
      expect(bound3).toBe(0)
    })
  });

})














