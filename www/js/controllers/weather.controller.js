(function() {
  'use strict';

  angular.module('app')
  .controller('WeatherController', WeatherController);
  WeatherController.$inject=['$scope','$window','$log', '$stateParams', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet',
  '$ionicModal', '$timeout', 'ubicacionesService', 'settingsService', 'forecastService',
  'utils','ttsService','sunCalService','$interval','$rootScope','alertaService'];

  /* @ngInject */
  function WeatherController($scope, $window, $log, $stateParams, $ionicPlatform, $ionicLoading, $ionicActionSheet,
    $ionicModal, $timeout, ubicacionesService, settingsService, forecastService,
    utils,ttsService,sunCalService,$interval,$rootScope,alertaService){

      var vm=this;
      vm.carga=false;
      vm.ko=false;
      vm.params = $stateParams;  //parametros que se han pasado desde la vista search con ui-sref, en app.js url: '/weather/:city/:lat/:lng'

      if(utils.getStorage('config')===null){
        utils.setStorage('config',settingsService.settings()); 
      }
      vm.settings = utils.getStorage('config');
      vm.hora=moment().format('HH');
      vm.minutos=moment().format('mm');
// {"lang":"es","units":"si","icono":"animado","days":"8"}

      /**
      * carga del loading ionic. duration: duración máxima. Tiene un lag de 1 segundo (en ionic hide)
      */
      vm.loadingOpen = function() {
        vm.carga=false;
        $ionicLoading.show({
          templateUrl: 'views/loadingIonic.html',
          duration: 10000
        });
      };
      vm.loadingClose = function(){
        $timeout(function () {
          $ionicLoading.hide();
          vm.carga=true;
        }, 1500);
      };


      //slider weather2.html para android
      vm.optionsSlider = {
        loop: false,
        speed: 400
      };
      vm.dataSlider = {};
      $scope.$watch('data.slider', function() {
        vm.slider = vm.dataSlider.slider;
      });
      //fin slider

      //datos del sol de un día
      vm.getDatosSol=function(hora){
        vm.datosSol =sunCalService.calcula('sol',vm.params.lat, vm.params.lng,1,hora);
        $log.debug('datosSol',vm.datosSol[0]);
      }
      //datos luna de un día
      vm.getDatosLuna=function(hora){
        vm.datosLuna =sunCalService.calcula('luna',vm.params.lat, vm.params.lng,1,hora);
        $log.debug('datosLuna',vm.datosLuna[0]);
      }


      vm.modoLiveFunc=function(){
        $interval.cancel($rootScope.modoLive);
        if(vm.settings.live===true){
          vm.getDatosSol();
          vm.getDatosLuna();
          //modo live. para refresco continuo de pantalla 3. posicion de sol y luna.
          $rootScope.modoLive=$interval(function(){
            vm.getDatosSol();
            vm.getDatosLuna();
            vm.fechaAhoraMismo=new Date();
            vm.hora=moment().format('HH');
            vm.minutos=moment().format('mm');
          }, 10000, 1000);
        }else{
          $log.debug('modo no live. hora: ', vm.hora);
          vm.getDatosSol(vm.hora);
          vm.getDatosLuna(vm.hora);
          vm.minutos=moment().format('mm');
        }
      };



      //refresca la pantalla y llama al rest forecast
      vm.refrescar = function() {
        vm.loadingOpen();
        $log.debug('llamando al refresco');
        vm.getDatosSol();
        vm.getDatosLuna();
        vm.modoLiveFunc();

        //llama a servicio forecast
        forecastService.getForecast(vm.params,vm.settings).then(function(response){
          vm.fechaAhoraMismo=new Date();

          vm.alertaHoras(response.hourly.data);
          vm.forecast = response;
          vm.resumenAlerta=response.hourly.summary;
          vm.ko=false;
          console.log('servicio forecast')
        }).catch(function(){
          vm.ko=true;
          $log.debug('error, sin internet!!!');
        }).finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          vm.loadingClose();

        });
      };




      vm.clickAlarma=function(frase){
        ttsService.habla(frase);
      };

       vm.alertaHoras= function(alertaHoras){
         vm.alarmaIcono=alertaService.alertaHoras(alertaHoras);
       };


      vm.refrescar();
      $window.addEventListener('orientationchange', function() {
        vm.carga=false;
        vm.refrescar();
      }, true);



      var barHeight = angular.element(document).find('ion-header-bar')[0].clientHeight;
      vm.getWidth = function () {
        return $window.innerWidth + 'px';
      };
      vm.getTotalHeight = function () {
        return parseInt(parseInt(vm.getHeight()) * 3) + 'px';
      };
      vm.getHeight = function () {
        return parseInt($window.innerHeight - barHeight) + 'px';
      };
      vm.showOptions = function () {
        $ionicActionSheet.show({
          titleText: 'Opciones',
          buttons: [
            {text: 'Añadir/remover favoritos'},
            {text: 'Seleccionar como primario'},
            {text: 'Calendario solar'},
            {text: 'Calendario lunar'}
          ],
          cancelText: 'Cancel',
          cancel: function() {
            $log.debug('CANCELLED');
          },

          buttonClicked: function (index) {
            if (index === 0) {
              ubicacionesService.toggle($stateParams);
            }else if (index === 1) {
              ubicacionesService.primary($stateParams);
            }else if (index === 2) {
              vm.showModal('sol');
            }else if (index === 3) {
              vm.showModal('luna');
            }
            return true;
          }
        });
      };

      vm.settings = utils.getStorage('config') || settingsService;
      vm.cambioToggleLive=function(){
        utils.setStorage('config',vm.settings);
        vm.modoLiveFunc();
        vm.hora=moment().format('HH');
        vm.minutos=moment().format('mm');
      };


      $scope.mimodal={};
      $scope.mimodal.params={
        lat: vm.params.lat,
        lng: vm.params.lng
      };
      vm.showModal = function (tipo) {
        var plantilla='';
        if(tipo==='sol'){
          plantilla='views/modal-sun.html';
        }else if(tipo==='luna'){
          plantilla='views/modal-moon.html';
        }
        $ionicModal.fromTemplateUrl(plantilla, {
          scope: $scope
        }).then(function (modal) {
          vm.modal = modal;

          $scope.mimodal.datos =sunCalService.calcula(tipo,vm.params.lat, vm.params.lng,368);
          console.log('mimodal.datos', $scope.mimodal.datos);
          vm.modal.show();
        });
      };

      $scope.hideModal = function () {
        //vm.modal.hide();
        vm.modal.remove();
      };
      //al destruirse el controllador, borra el modal:
      $scope.$on('$destroy', function() {
        try {
          vm.modal.remove();
        } catch (e) {
          //al iniciar y no se ha abierto, da error.
        }

      });

    }

  })();
