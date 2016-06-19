/**
* directiva que muestra la posición del sol y luna en una gráfica. Cuando se llame a la directiva,
* ha de ser centrada verticalmente.
*
*/

(function() {
  'use strict';

  angular
  .module('app')
  .directive('brujula', brujula);
  brujula.$inject=['$log','sunCalService',];

  /* @ngInject */
  function brujula($log,sunCalService) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'views/brujulaTemplate.html',
      scope: {
        tamanio: '@',
        centrado: '@',
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
      scope.centrado=true; //manualmente. aun no se ha preparado para centrado.

      scope.brujulaLunaDom=angular.element(el[0].querySelector('.lunaBrujula'));
      scope.brujulaSolDom=angular.element(el[0].querySelector('.solBrujula'));
      var posSol =sunCalService.calcula('sol',scope.lat, scope.lng,1)[0];
      var posLuna =sunCalService.calcula('luna',scope.lat, scope.lng,1)[0];
      console.log('possol brujula',posSol)
      scope.getPosicion= function() {

        if(scope.fecha && scope.lat && scope.lng){

          //var posLuna = MoonCalc.getMoonPosition(new Date(scope.fecha.replace(/"/g, '')), scope.lat, scope.lng);
          var anguloLuna = Math.PI/2 + posLuna.azimuth;
          var anguloSol=Math.PI/2 + posSol.azimuth;



          var radio=scope.tamanio/2;
          var xLuna=((radio * Math.cos(anguloLuna))*Math.cos(posLuna.altitude));
          var yLuna= ((radio * Math.sin(anguloLuna)) * Math.cos(posLuna.altitude));
          var xSol=((radio * Math.cos(anguloSol))*Math.cos(posSol.altitude));
          var ySol= ((radio * Math.sin(anguloSol)) * Math.cos(posSol.altitude));

          var altitudLunaGrados= (180 / Math.PI * posLuna.altitude).toFixed(2) ;
          var altitudSolGrados= (180 / Math.PI * posSol.altitude).toFixed(2) ;

          if(altitudLunaGrados>0){
            scope.lunaesVisible=true;
            scope.brujulaLunaDom.removeClass('icon ion-ios-moon-outline lunaInvisible');
            scope.brujulaLunaDom.addClass('icon ion-ios-moon lunaVisible');

          }else{
            scope.lunaesVisible=false;
            scope.brujulaLunaDom.removeClass('icon ion-ios-moon lunaVisible');
            scope.brujulaLunaDom.addClass('icon ion-ios-moon-outline lunaInvisible');
          }

          if(altitudSolGrados>0){
            scope.solesVisible=true;
            scope.brujulaSolDom.removeClass('icon ion-ios-sunny-outline solInvisible');
            scope.brujulaSolDom.addClass('icon ion-ios-sunny solVisible');

          }else{
            scope.solesVisible=false;
            scope.brujulaSolDom.removeClass('icon ion-ios-sunny solVisible');
            scope.brujulaSolDom.addClass('icon ion-ios-sunny-outline solInvisible');
          }

          return {
            xLuna: xLuna,
            yLuna: yLuna,
            altitudLuna: posLuna.altitude,
            xSol: xSol,
            ySol: ySol,
            altitudSol: posSol.altitude
          };
        }

      };



    }
  }


})();
