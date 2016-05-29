(function() {
  'use strict';

  angular.module('app')
  .factory('geocodeService', geocodeService);
  geocodeService.$inject=['$http','$q','$log'];

  /* @ngInject */
  function geocodeService($http,$q,$log){
    var vm=this;
    vm.getGeocode=function(busqueda){
      var defer = $q.defer();
      var promise = defer.promise;
      if(busqueda.indexOf('{')===0 && busqueda.indexOf('}')>5){ //si vienen los datos por lat o lon
        var latLon=busqueda.substr(1, busqueda.length-2);

        $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {latlng: latLon}, key: 'AIzaSyD_kpKUxOoKJBDfr7FtCuTJhkJBm0o71Ok'})
        .then(function(response){
          defer.resolve(response.data);
        })
        .catch(function(err) {
          $log.error(err);
          defer.reject(err);
        });
      }else{
        $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: busqueda}, key: 'AIzaSyD_kpKUxOoKJBDfr7FtCuTJhkJBm0o71Ok'})
        .then(function(response){
          defer.resolve(response.data);
        })
        .catch(function(err) {
          $log.error(err);
          defer.reject(err);
        });
      }
      return promise;
    };


    return vm;
  }

})();
