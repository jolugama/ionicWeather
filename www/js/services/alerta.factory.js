(function() {
    'use strict';

    angular
        .module('app')
        .factory('alertaService', alertaService);

    alertaService.$inject = ['utils','settingsService','$log','$cordovaVibration','ttsService'];

    /* @ngInject */
    function alertaService(utils,settingsService,$log,$cordovaVibration,ttsService) {
        var service = {
            alertaHoras: _alertaHoras
        };

        return service;

        function _alertaHoras(arrayHoras){
          //clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night
          var lluvia=false;
          var nieve=false;
          var aguanieve=false;
          var muchoViento=false;
          var muchoCalor=false;
          var muchoFrio=false;
          var alarmaIcono=[];
          //busca si hay alarmas en alguna hora del día.
          //Si hay más de una, mostrará si llueve o nieva, hace viento fuerte, clima muy alto o muy bajo, por este orden

          var MAX_TEMP=35;
          var MIN_TEMP=0;
          var MAX_VIENTO=11;
          var settings = utils.getStorage('config') || settingsService;
          //si esta en modo us, transformamos los max, min a farenheit. y millas/h
          if(settings.units==='us'){
            MAX_TEMP= MAX_TEMP * 9 / 5 + 32;
            MIN_TEMP= MIN_TEMP * 9 / 5 + 32;
            MAX_VIENTO= MAX_VIENTO/0.44704;
          }

          //de las mas de 48 horas que envia, solo quiero las 12.
          if(arrayHoras.length>12){
            arrayHoras=arrayHoras.slice(0,12);
          }
          for (var i = 0; i < arrayHoras.length; i++) {
            if(parseFloat(arrayHoras[i].temperatureMax || arrayHoras[i].temperature) > MAX_TEMP){
              if(muchoCalor===false){
                alarmaIcono.push('muchoCalor');
              }
              muchoCalor=true;
            }else if(parseFloat(arrayHoras[i].temperatureMax ) < MIN_TEMP){
              if(muchoFrio===false){
                alarmaIcono.push('muchoFrio');
              }
              muchoFrio=true;

            }

            if(parseFloat(arrayHoras[i].windSpeed) > MAX_VIENTO){
              if(muchoViento===false){
                alarmaIcono.push('wind');
              }
              muchoViento=true;

            }

            if(arrayHoras[i].icon==='rain'){
              if(lluvia===false){
                alarmaIcono.push('rain');
              }
              lluvia=true;
            }else if(arrayHoras[i].icon==='snow'){
              if(nieve===false){
                alarmaIcono.push('snow');
              }
              nieve=true;
            }else if(arrayHoras[i].icon==='sleet'){
              if(aguanieve===false){
                alarmaIcono.push('sleet');
              }
              aguanieve=true;

            }

          }

          if(alarmaIcono.length===0){
            alarmaIcono.push('info'); // icono por defecto en alarma
          }
          $log.debug('alarmaIcono',alarmaIcono);

          var frase='';
          if(lluvia || nieve || aguanieve){
            frase='Posibilidad de lluvia.';
            try {
              $cordovaVibration.vibrate([100, 500, 500, 500, 1000]);
            } catch (e) {

            }
            if(nieve || aguanieve){
              frase+='Posibilidad de nieve o aguanieve. ';
              try {
                $cordovaVibration.vibrate([1000, 1000, 3000, 1000, 5000]);

              } catch (e) {

              }
            }
          }
          if(muchoViento){
            frase+='hace mucho viento.'
            try {
              $cordovaVibration.vibrate(500);
            } catch (e) {

            }
          }
          if(muchoCalor){
            frase+='hace mucho calor.';
            try {
              $cordovaVibration.vibrate(500);
            } catch (e) {

            }
          }else if(muchoFrio){
            frase+='hace mucho frío.';
            try {
              $cordovaVibration.vibrate(500);
            } catch (e) {

            }
          }
          ttsService.habla(frase);

          return alarmaIcono;
        }
    }
})();
