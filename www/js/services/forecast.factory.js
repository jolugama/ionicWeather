(function() {
  'use strict';

angular.module('app')
.factory('forecastService',forecastService);
forecastService.$inject=['$http','$q','$log'];

/* @ngInject */
function forecastService($http,$q,$log){

  var service = {
    getForecast: _getForecast
  };

  return service;


  function _getForecast(stateParams,settings){
    var defer = $q.defer();
    var promise = defer.promise;
    //upload https://api.darksky.net/forecast/fbff4e86f9ba7ea95551c176e59ddb03/ en lugar de api/forecast/
    $http.get('https://api.darksky.net/forecast/fbff4e86f9ba7ea95551c176e59ddb03/' + stateParams.lat + ',' + stateParams.lng, {params: {units: settings.units, lang: settings.lang}}).then(function(response){
      $log.debug('rest forecast',response.data);
      defer.resolve(response.data);
    })
    .catch(function(err) {
      $log.error(err);
      defer.reject(err);
    });
    return promise;
  }


}

})();
