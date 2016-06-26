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
  brujula.$inject=['$log','sunCalService'];

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
        lng: '@',
        altitudSol: '@',
        azimuthSol: '@',
        altitudLuna: '@',
        azimuthLuna: '@'
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


      scope.getPosicion= function() {
        var xLuna=0;
        var yLuna=0;
        var xSol=0;
        var ySol=0;

        var posSol={
          azimuth:0,
          altitude:0
        };
        var posLuna={
          azimuth:0,
          altitude:0
        };

        if(scope.lat && scope.lng){
          posSol =sunCalService.calcula('sol',scope.lat, scope.lng,1)[0];
          posLuna =sunCalService.calcula('luna',scope.lat, scope.lng,1)[0];
          //var posLuna = MoonCalc.getMoonPosition(new Date(scope.fecha.replace(/"/g, '')), scope.lat, scope.lng);
        } else if(scope.altitudSol && scope.azimuthSol  && scope.altitudLuna  && scope.azimuthLuna){

          posLuna.azimuth=parseFloat(scope.azimuthLuna);
          posLuna.altitude=parseFloat(scope.altitudLuna);
          posSol.azimuth=parseFloat(scope.azimuthSol);
          posSol.altitude=parseFloat(scope.altitudSol);
        }

        var anguloLuna = Math.PI/2 + posLuna.azimuth;
        var anguloSol= Math.PI/2 + posSol.azimuth;
        var radio=scope.tamanio/2-20;
        xLuna=((radio * Math.cos(anguloLuna))* Math.cos(posLuna.altitude)).toFixed(3);
        yLuna= ((radio * Math.sin(anguloLuna)) * Math.cos(posLuna.altitude)).toFixed(3);
        xSol=((radio * Math.cos(anguloSol))* Math.cos(posSol.altitude)).toFixed(3);
        ySol= ((radio * Math.sin(anguloSol)) * Math.cos(posSol.altitude)).toFixed(3);

        var altitudLunaGrados= (180 / Math.PI * posLuna.altitude).toFixed(3);
        var altitudSolGrados= (180 / Math.PI * posSol.altitude).toFixed(3);

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
          //  altitudLuna: posLuna.altitude,
          xSol: xSol,
          ySol: ySol
          //  altitudSol: posSol.altitude
        };


      };



    }
  }


})();
