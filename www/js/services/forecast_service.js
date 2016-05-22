angular.module('App')
.factory('forecastService',ForecastService);
ForecastService.$inject=['$http','$q','$log'];

function ForecastService($http,$q,$log){
  var vm=this;
  vm.getForecast=function(stateParams,settings){
    var defer = $q.defer();
    var promise = defer.promise;
    //upload https://api.forecast.io/forecast/fbff4e86f9ba7ea95551c176e59ddb03/ en lugar de /api/forecast/
    $http.get('/api/forecast/' + stateParams.lat + ',' + stateParams.lng, {params: {units: settings.units, lang: settings.lang}}).then(function(response){
      $log.debug('rest forecast',response.data);
      defer.resolve(response.data);
    })
    .catch(function(err) {
      $log.error(err);
      defer.reject(err);
    });
    return promise;
  };


  return vm;
}
