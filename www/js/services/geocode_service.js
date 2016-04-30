angular.module('App')
.factory('geocodeService', GeocodeService);
GeocodeService.$inject=['$http','$log'];


function GeocodeService($http,$log){
  var vm=this;
  vm.getGeocode=function(busqueda){
    $log.debug('rest geocode');
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: busqueda}})
    .then(function(response){
      return response.data;
    })
    .catch(function(error) {
      $log.error(error);
      return error;
    });
  };
  return vm;
}
