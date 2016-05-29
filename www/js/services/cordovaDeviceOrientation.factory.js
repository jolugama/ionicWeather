(function() {
  'use strict';
  angular.module('app')
  .factory('cordovaDeviceOrientationService',cordovaDeviceOrientationService);
  cordovaDeviceOrientationService.$inject=['$q','$cordovaDeviceOrientation','$log'];

  /* @ngInject */
  function cordovaDeviceOrientationService($q,$cordovaDeviceOrientation,$log){
    var vm=this;

    vm.orientacionDispositivo=function(){
      var defer = $q.defer();
      var promise = defer.promise;

      $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
        debugger;
        var magneticHeading = result.magneticHeading;
        var trueHeading = result.trueHeading;
        var accuracy = result.headingAccuracy;
        var timeStamp = result.timestamp;
        console.log(result)
        defer.resolve(result);
      }).catch(function(err){
        $log.error(err);
        defer.reject(err);
      });
      return promise;
    };



    var options = {
      frequency: 3000,
      filter: true     // if frequency is set, filter is ignored
    }

    // vm.watch = $cordovaDeviceOrientation.watchHeading(options).then(
    //   null,
    //   function(error) {
    //     // An error occurred
    //   },
    //   function(result) {   // updates constantly (depending on frequency value)
    //     var magneticHeading = result.magneticHeading;
    //     var trueHeading = result.trueHeading;
    //     var accuracy = result.headingAccuracy;
    //     var timeStamp = result.timestamp;
    //   });


    // vm.watch.clearWatch();
    // OR
    // $cordovaDeviceOrientation.clearWatch(vm.watch)
    //   .then(function(result) {
    //     // Success!
    //   }, function(err) {
    //     // An error occurred
    //   });

    


    return vm;

  }

})();
