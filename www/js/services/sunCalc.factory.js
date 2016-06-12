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

    function calcula(tipo,lat,lon,dias) {

      var days = [];
      var day = Date.now();
        day -= 1000 * 60 * 60 * 24;
      for (var i = 0; i < dias; i++) {
        day += 1000 * 60 * 60 * 24;
        if(tipo==='sol'){
          days.push(SunCalc.getTimes(day, lat, lon));

          var nuevoObjeto = angular.extend({}, days[days.length-1], SunCalc.getPosition(day, lat, lon));
          days[days.length-1]=nuevoObjeto;

        }else if(tipo==='luna'){
          days.push(SunCalc.getMoonTimes(day, lat, lon));

          days[days.length-1].fecha=day; //añado la fecha al array

          var nuevoObjeto = angular.extend({}, days[days.length-1], SunCalc.getMoonIllumination(day));
          days[days.length-1]=nuevoObjeto;

          var nuevoObjeto2 = angular.extend({}, days[days.length-1], MoonCalc.getMoonPosition(new Date(day),lat,lon));
          days[days.length-1]=nuevoObjeto2;

          days[days.length-1].superLuna=parseInt(days[days.length-1].distance)<365000 ? true : "";
          days[days.length-1].tamanio=days[days.length-1].superLuna===true ? 55 : 40;

          //por si no hay rise, la hora sera las 00: 00;
          days[days.length-1].horaLuna=days[days.length-1].rise ? days[days.length-1].rise : new Date(days[days.length-1].fecha);

        }
      }
      return days;

    }
  }
})();
