angular.module('App')
.factory('forecastService',ForecastService);
ForecastService.$inject=['$http','$log'];

function ForecastService($http,$log){
  var vm=this;
  vm.getForecast=function(stateParams,settings){
    //upload https://api.forecast.io/forecast/fbff4e86f9ba7ea95551c176e59ddb03/ en lugar de /api/forecast/
    return $http.get('/api/forecast/' + stateParams.lat + ',' + stateParams.lng, {params: {units: settings.units, lang: settings.lang}})
    .then(function(response){
      $log.debug('rest forecast',response.data);
      return response.data;
    })
    .catch(function(error) {
      $log.error(error);
      return error;
    });

  };
  return vm;
}
