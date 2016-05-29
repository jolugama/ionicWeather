(function() {
  'use strict';

  angular.module('app')
  .controller('WeatherController', WeatherController);
  WeatherController.$inject=['$scope','$window','$log', '$stateParams', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet',
  '$ionicModal', '$timeout', 'ubicacionesService', 'settingsService', 'forecastService','$cordovaVibration','cordovaDeviceOrientationService',
  'utils','ttsService','sunCalService'];

  /* @ngInject */
  function WeatherController($scope, $window, $log, $stateParams, $ionicPlatform, $ionicLoading, $ionicActionSheet,
    $ionicModal, $timeout, ubicacionesService, settingsService, forecastService, $cordovaVibration, cordovaDeviceOrientationService,
    utils,ttsService,sunCalService){

      var vm=this;
      vm.carga=false;
      vm.params = $stateParams;  //parametros que se han pasado desde la vista search con ui-sref, en app.js url: '/weather/:city/:lat/:lng'

      vm.settings = utils.getStorage('config') || settingsService;
      vm.AlarmaIcono='info'; // icono por defecto en alarma


      /**
      * carga del loading ionic. duration: duración máxima. Tiene un lag de 1 segundo (en ionic hide)
      */
      vm.loadingOpen = function() {
        vm.carga=false;
        $ionicLoading.show({
          templateUrl: '../views/loadingIonic.html',
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


      //refresca la pantalla y llama al rest forecast
      vm.refrescar = function() {
        vm.loadingOpen();
        $log.debug('llamando al refresco');
        //llama a servicio forecast
        forecastService.getForecast(vm.params,vm.settings).then(function(response){
          vm.alertaHoras(response.hourly.data);
          vm.forecast = response;
          vm.resumenAlerta=response.hourly.summary;
        }).finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
          vm.loadingClose();

        });
      };




      vm.clickAlarma=function(frase){
        ttsService.habla(frase);
      };


      vm.alertaHoras=function(arrayHoras){
        //clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night
        var lluvia=false;
        var nieve=false;
        var aguanieve=false;

        var muchoViento=false;
        var muchoCalor=false;
        var muchoFrio=false;

        //busca si hay alarmas en alguna hora del día.
        //Si hay más de una, mostrará si llueve o nieva, hace viento fuerte, clima muy alto o muy bajo, por este orden
        for (var i = 0; i < arrayHoras.length; i++) {
          if(parseFloat(arrayHoras[i].temperatureMax || arrayHoras[i].temperature) > 35){
            muchoCalor=true;
            vm.AlarmaIcono='muchoCalor';
          }else if(parseFloat(arrayHoras[i].temperatureMax ) < 0){
            muchoFrio=true;
            vm.AlarmaIcono='muchoFrio';
          }

          if(parseFloat(arrayHoras[i].windSpeed) > 11){
            muchoViento=true;
            vm.AlarmaIcono='wind';
          }

          if(arrayHoras[i].icon==='rain'){
            lluvia=true;
            vm.AlarmaIcono='rain';
          }else if(arrayHoras[i].icon==='snow'){
            nieve=true;
            vm.AlarmaIcono='snow';
          }else if(arrayHoras[i].icon==='sleet'){
            aguanieve=true;
            vm.AlarmaIcono='sleet';
          }

        }

        var frase='';
        if(lluvia || nieve || aguanieve){
          frase='Hoy llévate paraguas. ';
          try {
            $cordovaVibration.vibrate([100, 500, 500, 500, 1000]);
          } catch (e) {

          }
          if(nieve || aguanieve){
            frase+='Si conduces ten cuidado, nieve o aguanieve. ';
            try {
              $cordovaVibration.vibrate([1000, 1000, 3000, 1000, 5000]);

            } catch (e) {

            }
          }
        }
        if(muchoViento){
          frase+='Cuidado: Viento huracanado.'
          try {
            $cordovaVibration.vibrate(500);
          } catch (e) {

          }
        }
        if(muchoCalor){
          frase+='Vístete ligero, hace mucho calor';
          try {
            $cordovaVibration.vibrate(500);
          } catch (e) {

          }
        }else if(muchoFrio){
          frase+='Vístete bien abrigado, hace mucho frío';
          try {
            $cordovaVibration.vibrate(500);
          } catch (e) {

          }
        }
        ttsService.habla(frase);

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

      $scope.mimodal={};
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
          if(tipo==='sol'){
            $scope.mimodal.chart =sunCalService.calcula(tipo,vm.params.lat, vm.params.lng);
          }else if(tipo==='luna'){
            $scope.mimodal.chart =sunCalService.calcula(tipo,vm.params.lat, vm.params.lng);
          }

          console.log('chart', $scope.mimodal.chart);
          vm.modal.show();
        });
      };

      $scope.hideModal = function () {
        //vm.modal.hide();
        vm.modal.remove();
      };
      //al destruirse el controllador, borra el modal:
      $scope.$on('$destroy', function() {
        vm.modal.remove();
      });

    }

  })();
