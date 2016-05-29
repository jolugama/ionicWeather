(function() {
  'use strict';

  angular.module('app')
  .factory('cordovaGeolocationService',cordovaGeolocationService);
  cordovaGeolocationService.$inject=['$q','$cordovaGeolocation','$log'];

  /* @ngInject */
  function cordovaGeolocationService($q,$cordovaGeolocation,$log){
    var vm=this;

    vm.geolocation=function(){
      var defer = $q.defer();
      var promise = defer.promise;
      var posOptions = {timeout: 20000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (response) {
        $log.debug('rest geolocation',response.coords);
        defer.resolve(response.coords);
      }).catch(function(err){
        $log.error(err);
        defer.reject(err);
      });
      return promise;
    };


    return vm;
  }

})();
