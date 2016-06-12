(function() {
  'use strict';

  angular
  .module('app')
  .controller('SearchController', SearchController);

  SearchController.$inject=['$scope','$log','$timeout','$ionicPopup','$ionicLoading','geocodeService','cordovaGeolocationService',
  '$cordovaKeyboard','utils','ubicacionesService','$state'];

  /* @ngInject */
  function SearchController($scope, $log, $timeout, $ionicPopup, $ionicLoading, geocodeService, cordovaGeolocationService,
    $cordovaKeyboard,utils,ubicacionesService,$state) {
      var vm = this;

      vm.busqueda = '';
      vm.bloqueo=false;

      vm.esAndroid=false;
      if(ionic && ionic.Platform){
        vm.esAndroid=ionic.Platform.isAndroid();
      }

      vm.loadingOpen = function() {
        $ionicLoading.show({
          templateUrl: 'views/loadingIonic.html',
          duration: 10000
        });
      };
      vm.loadingClose = function(){
        $timeout(function () {
          $ionicLoading.hide();
        }, 2500);
      };


      vm.onclickInput=function(){
        vm.busqueda='';
        vm.buscar(0);
      }

      /**
      * abre una alerta ionic
      * @param  {string} titulo  titulo de la alerta
      * @param  {string} mensaje mensaje de la alerta
      */
      vm.alertPopup=function(titulo,mensaje){
        var alerta= $ionicPopup.alert({
          title: titulo,
          template: mensaje
        });
        alerta.then(function(){});
      };

      /**
      * [buscar description]
      * @param  {number} tiempo tiempo de respuesta para llamada al servicio. si es 0 es desde el boton, sino, mediante directiva on-change
      * @return {object} vm.resultadoBusqueda    contiene la dirección que se mostrará en la vista.
      */
      vm.buscar = function (tiempo) {
        if(vm.bloqueo===true){
          return;
        }
        vm.bloqueo=true;
        $timeout(function () {
          vm.bloqueo=false;
          var busqueda=vm.busqueda;
          if(busqueda.length<1){
            vm.resultadoBusqueda='';
            return;
          }
          if( busqueda.indexOf(',')===-1 && busqueda.length>1){
            busqueda+=',es';
          }

          //llama a servicio geocode
          geocodeService.getGeocode(busqueda).then(function(response){
            vm.resultadoBusqueda=response.results;
            if(angular.isUndefined(vm.resultadoBusqueda)){
              angular.element('#upload').trigger('click');
              vm.alertPopup('houston','Ups, no nos llegan datos, inténtalo más tarde');
            }
          });

        }, tiempo);
      };

      vm.geoLocaliza=function(){
        vm.busqueda='';
        try {
          $cordovaKeyboard.close();
          vm.isVisible = $cordovaKeyboard.isVisible();
        } catch (e) {
          $log.debug('cordovaKeyboard error');
          vm.isVisible = true;
        }

        $scope.$watch('isVisible', function(newValue, oldValue) {
          if((newValue===false && oldValue===true) || angular.isUndefined(newValue)){
            vm.loadingOpen();
            cordovaGeolocationService.geolocation().then(function(response){
              var result='{'+response.latitude+','+response.longitude + '}';
              if(response!==''){
                vm.busqueda=result;
                vm.buscar(0);
              }else{
                $log.debug('geoLocaliza: sin datos');
              }

            }).catch(function(e){
              console.log('geoLocaliza error', e);
            }).finally(function(){
              vm.loadingClose();
            });
          }
        });

      };

      ionic.Platform.ready(function(){
        if(utils.getStorage('data')){
          var ubicacion = ubicacionesService.data[0];
          var esAndroid=false;
          if(ionic && ionic.Platform){
            esAndroid=ionic.Platform.isAndroid();
          }

          if(esAndroid){
            $state.go('weather2',{city: ubicacion.city, lat: ubicacion.lat, lng: ubicacion.lng});
          }else{
            $state.go('weather',{city: ubicacion.city, lat: ubicacion.lat, lng: ubicacion.lng});
          }

        }else{
          vm.geoLocaliza();
        }
      });

    }
  })();
