(function() {
  'use strict';

  angular
  .module('app')
  .directive('faseLunar', faseLunar);
  faseLunar.$inject=['$log'];

  /* @ngInject */
  function faseLunar($log) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'views/faseLunarTemplate.html',
      scope: {
        tamanioLuna: '@',
        grados: '@',
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

      scope.shape = function() {
        var phase=0;
        //2 opciones, por grados y por fecha, latitud y longitud. Se necesita moonPos.
        if(scope.grados){
          phase=scope.grados/360;
          scope.fase='circulo';
        }else if(window.MoonCalc && scope.fecha && scope.lat && scope.lng){
          var moonPos=MoonCalc.getMoonPosition(new Date(scope.fecha.replace(/"/g, '')),scope.lat,scope.lng);
          phase=moonPos.altergrad/360;
        }else{
          $log.debug('faltan atributos, atributos erroneos o no se ha cargado la librería MoonCalc');
        }

        var radio=scope.tamanioLuna/2;

        var sweep = [];
        var mag;
        if (phase <= 0.25) {
          sweep = [1, 0];
          mag = 20 - 20 * phase * 4;
        } else
        if (phase <= 0.50) {
          sweep = [0, 0];
          mag = 20 * (phase - 0.25) * 4;
        } else
        if (phase <= 0.75) {
          sweep = [1, 1];
          mag = 20 - 20 * (phase - 0.50) * 4;
        } else
        if (phase <= 1) {
          sweep = [0, 1];
          mag = 20 * (phase - 0.75) * 4;
        } else {
          exit;
        }
        var d = "m" + radio + ",0 ";
        d = d + "a" + mag + ",20 0 0," + sweep[0] + " 0," + radio * 2 + " ";
        d = d + "a20,20 0 0," + sweep[1] + " 0,-" + radio * 2;
        //console.log(d);
        return d;
      };
    }
  }


})();
