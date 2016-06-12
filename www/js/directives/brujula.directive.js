(function() {
  'use strict';

  angular
  .module('app')
  .directive('brujula', brujula);
  brujula.$inject=['$log'];

  /* @ngInject */
  function brujula($log) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'views/brujulaTemplate.html',
      scope: {
        fecha: '@',
        lat: '@',
        lng: '@'
      },
      link: linkFunc
      // controller: Controller,
      // controllerAs: 'vm',
      // bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

      scope.getMoonPosPoint= function() {
        if(window.MoonCalc && scope.fecha && scope.lat && scope.lng){
              
          var pos = MoonCalc.getMoonPosition(new Date(scope.fecha.replace(/"/g, '')), scope.lat, scope.lng),
          angle = Math.PI/2 + pos.azimuth;
          return {
            x: this._centerX + this.RADIUS * Math.cos(angle) * Math.cos(pos.altitude),
            y: this._centerY + this.RADIUS * Math.sin(angle) * Math.cos(pos.altitude),
            altitude: pos.altitude
          };
        }

      }

    }
  }


})();
