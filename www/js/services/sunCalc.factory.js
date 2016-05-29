(function() {
  'use strict';

  angular
  .module('app')
  .factory('sunCalService', sunCalService);

  sunCalService.$inject = [];

  /* @ngInject */
  function sunCalService() {
    var service = {
      calcula: calcula
    };

    return service;

    function calcula(tipo,lat,lon) {

      var days = [];
      var day = Date.now();
      for (var i = 0; i < 365; i++) {
        day += 1000 * 60 * 60 * 24;
        if(tipo==='sol'){
          days.push(SunCalc.getTimes(day, lat, lon));
        }else if(tipo==='luna'){
          days.push(SunCalc.getMoonTimes(day, lat, lon));
          var nuevoObjeto = angular.extend({}, days[days.length-1], SunCalc.getMoonIllumination(day));
          days[days.length-1]=nuevoObjeto;
        //  debugger;



        }
      }
      return days;

    }
  }
})();
