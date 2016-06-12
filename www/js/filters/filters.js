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

  .filter('horasMinutos', function () {
    return function (input) {
      moment.locale('es');
      return moment(input).format('HH:mm');

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

  .filter('altitud', function () {
    return function (n) {
      if (n) {
        var altitud= (180 / Math.PI * n).toFixed(2) ;
        return altitud+'º';
        //return altitud>0 ? altitud+'º' : ' - ';
      }
    };
  })

  .filter('azimuth', function () {
    return function (n) {
      if (n) {

        var num=parseFloat(((180 / Math.PI * n) + 180).toFixed(2));
        var result='';
        if(num>270 ||num<90){
          result=num+'º N';
        }else{
          result=num+'º S';
        }

        if(num>0 && num<180){
          result=result+'E';
        }else if(num>180 && num<360){
          result=result+'O';
        }


        return result;

      }
    };
  })



  .filter('temperatura', function (settingsService,utils) {
    return function (n) {
      if (n) {
        var value = Math.round(n);

        var settings = utils.getStorage('config') || settingsService;
        if(settings.units==='si'){
          value+='ºC';
        }else{
          value+='F';
        }
        return  value;
      }
    };
  })
  .filter('viento', function(settingsService,utils){
    return function(n){
      var value = Math.round(n);
      var settings = utils.getStorage('config') || settingsService;
      if(settings.units==='si'){
        value+='m/s';
      }else{
        value+='millas/hora';
      }
      return  value;
    };
  })
  .filter('visibilidad', function(settingsService,utils){
    return function(n){
      var value = Math.round(n);
      var settings = utils.getStorage('config') || settingsService;
      if(settings.units==='si'){
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
      'muchoCalor':'ion-flame',
      'muchoFrio':'ion-ios-snowy',
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



  .filter('descViento', ['escalaVientoService', function(escalaVientoService) {
    return function(metros) {
      if(metros){
        return escalaVientoService.getDescripcion(Math.round(metros*10)/10)[0];
      }

    }
  }]);



})();
