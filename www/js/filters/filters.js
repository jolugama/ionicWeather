(function() {
  'use strict';

  angular.module('app')
  .filter('timezone', function () {
    return function (input, timezone) {
      if (input && timezone) {
        var time = moment.tz(input * 1000, timezone);
        return time.format('LT');
      }
      return '';
    };
  })

  .filter('diaSemana', function () {
    return function (input, timezone) {
      if (input && timezone) {
        moment.locale('es');
        var time = moment.tz(input * 1000, timezone);
        var fecha=time.format('llll').split('.');
        return fecha[0]+fecha[1];
      }
      return '';
    };
  })

  .filter('diaMes', function () {
    return function (input) {
      if (input) {
        moment.locale('es');
        var time = moment(input);
        return time.format('DD MMM');
      }
      return '';
    };
  })

  .filter('porcentajeRedondeo', function () {
    return function (n) {
      if (n) {
        var value = Math.round(n * 10);
        return value!==0 ? (value * 10) + '%' : '';
      }

    };
  })
  .filter('porcentaje', function () {
    return function (n) {
      if (n) {
        var value = n * 100;
        return value!==0 ? Math.round(value) + '%' : '';
      }
    };
  })

  .filter('temperatura', function (settingsService) {
    return function (n) {
      if (n) {
        var value = Math.round(n);

        if(settingsService.units==='si'){
          value+='ºC';
        }else{
          value+='F';
        }
        return  value;
      }
    };
  })
  .filter('viento', function(settingsService){
    return function(n){
      var value = Math.round(n);
      if(settingsService.units==='si'){
        value+='m/s';
      }else{
        value+='millas/hora';
      }
      return  value;
    };
  })
  .filter('visibilidad', function(settingsService){
    return function(n){
      var value = Math.round(n);
      if(settingsService.units==='si'){
        value+='km';
      }else{
        value+='millas';
      }
      return  value;
    };
  })

  .filter('icons', function () {
    var map = {
      'clear-day': 'ion-ios-sunny',
      'clear-night': 'ion-ios-moon',
      rain: 'ion-ios-rainy',
      snow: 'ion-ios-snowy',
      sleet: 'ion-ios-rainy',
      wind: 'ion-ios-flag',
      fog: 'ion-ios-cloud',
      cloudy: 'ion-ios-cloudy',
      'partly-cloudy-day': 'ion-ios-partlysunny',
      'partly-cloudy-night': 'ion-ios-cloudy-night',
      'muchoCalor':'ion-thermometer',
      'muchoFrio':'ion-thermometer',
      'info': 'ion-information'

    };
    return function (icon) {
      return map[icon] || '';
    };
  })

  .filter('redondeoMiles',function(){
    return function(n){
      return Math.round(n/100)*100;
    };
  })
  .filter('trim', function () {
    return function(value) {
      if(!angular.isString(value)) {
        return value;
      }
      return value.replace(/^\s+|\s+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
  })

  .filter('nombreFaseLunar', function () {
    var map = {
      'New Moon': 'Luna nueva',
      'Waxing Crescent': 'Cuarto creciente',
      'First Quarter': 'Primer cuarto',
      'Waxing Gibbous' : 'Luna gibosa creciente',
      'Full Moon': 'Luna llena',
      'Waning Gibbous': 'Luna gibosa menguante',
      'Waning Crescent': 'Cuarto menguante',
      'Third Quarter':'Último cuarto'
    };
    return function (nombreLuna) {
      return map[nombreLuna] || '';
    };
  })

})();
