angular.module('App')
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
      return time.format('dddd');
    }
    return '';
  };
})

.filter('nombreMes', function () {
  return function (input) {
    if (input) {
      moment.locale('es');
      var time = moment(input);
      return time.format('DD MMMM');
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
      return value!==0 ? value + '%' : '';
    }
  };
})
.filter('temperatura', function (Settings) {
  return function (n) {
    if (n) {
      var value = Math.round(n);
      if(Settings.units==='si'){
        value+='ºC';
      }else{
        value+='F';
      }
      return  value;
    }
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
    'partly-cloudy-night': 'ion-ios-cloudy-night'
  };
  return function (icon) {
    return map[icon] || '';
  }
})
