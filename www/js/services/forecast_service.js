angular.module('App')
.factory('forecastService',ForecastService);
ForecastService.$inject=['$http','$log'];

function ForecastService($http,$log){
  var vm=this;
  vm.getForecast=function(stateParams,settings){
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
