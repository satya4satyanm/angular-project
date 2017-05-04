'use strict';

describe('login Controller', function() {
  var $controller;

    beforeEach(module('roviVCapp'));

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));

    describe('all tests for login controller', function() {
      var $scope, controller;

      beforeEach(function() {
        $scope = {};
        controller = $controller('loginController', { $scope: $scope });
      });

      it('sample test', function() {
          var test = $scope.test();
          expect(test).toEqual("Test is ready");
      })

    });

});
