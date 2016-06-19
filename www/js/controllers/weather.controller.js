(function() {
  'use strict';

  angular.module('app')
  .controller('WeatherController', WeatherController);
  WeatherController.$inject=['$scope','$window','$log', '$stateParams', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet',
  '$ionicModal', '$timeout', 'ubicacionesService', 'settingsService', 'forecastService','$cordovaVibration','cordovaDeviceOrientationService',
  'utils','ttsService','sunCalService','$interval','$rootScope'];

  /* @ngInject */
  function WeatherController($scope, $window, $log, $stateParams, $ionicPlatform, $ionicLoading, $ionicActionSheet,
    $ionicModal, $timeout, ubicacionesService, settingsService, forecastService, $cordovaVibration, cordovaDeviceOrientationService,
    utils,ttsService,sunCalService,$interval,$rootScope){

      var vm=this;
      vm.carga=false;
      vm.ko=false;
      vm.params = $stateParams;  //parametros que se han pasado desde la vista search con ui-sref, en app.js url: '/weather/:city/:lat/:lng'

      vm.settings = utils.getStorage('config') || settingsService;



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
      vm.getDatosSol=function(){
        vm.datosSol =sunCalService.calcula('sol',vm.params.lat, vm.params.lng,1);
        $log.debug('datosSol',vm.datosSol[0]);
      }
      //datos luna de un día
      vm.getDatosLuna=function(){
        vm.datosLuna =sunCalService.calcula('luna',vm.params.lat, vm.params.lng,1);
        $log.debug('datosLuna',vm.datosLuna[0]);
      }


      //modo live. para refresco continuo de pantalla 3. posicion de sol y luna.
      $interval.cancel($rootScope.modoLive);
      if(vm.settings.live===true){
        $rootScope.modoLive=$interval(function(){
          vm.getDatosSol();
          vm.getDatosLuna();
          vm.fechaAhoraMismo=new Date();
        }, 10000, 1000);
      }

      //refresca la pantalla y llama al rest forecast
      vm.refrescar = function() {
        vm.loadingOpen();
        $log.debug('llamando al refresco');
        vm.getDatosSol();
        vm.getDatosLuna();


        //llama a servicio forecast
        forecastService.getForecast(vm.params,vm.settings).then(function(response){
          vm.fechaAhoraMismo=new Date();
          vm.alertaHoras(response.hourly.data);
          vm.forecast = response;
          vm.resumenAlerta=response.hourly.summary;
          vm.ko=false;
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


      vm.alertaHoras=function(arrayHoras){
        //clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night
        var lluvia=false;
        var nieve=false;
        var aguanieve=false;
        var muchoViento=false;
        var muchoCalor=false;
        var muchoFrio=false;
        vm.AlarmaIcono=[];
        //busca si hay alarmas en alguna hora del día.
        //Si hay más de una, mostrará si llueve o nieva, hace viento fuerte, clima muy alto o muy bajo, por este orden

        var MAX_TEMP=35;
        var MIN_TEMP=0;
        var MAX_VIENTO=11;
        var settings = utils.getStorage('config') || settingsService;
        //si esta en modo us, transformamos los max, min a farenheit. y millas/h
        if(settings.units==='us'){
          MAX_TEMP= MAX_TEMP * 9 / 5 + 32;
          MIN_TEMP= MIN_TEMP * 9 / 5 + 32;
          MAX_VIENTO= MAX_VIENTO/0.44704;
        }

        for (var i = 0; i < arrayHoras.length; i++) {
          if(parseFloat(arrayHoras[i].temperatureMax || arrayHoras[i].temperature) > MAX_TEMP){
            if(muchoCalor===false){
              vm.AlarmaIcono.push('muchoCalor');
            }
            muchoCalor=true;
          }else if(parseFloat(arrayHoras[i].temperatureMax ) < MIN_TEMP){
            if(muchoFrio===false){
              vm.AlarmaIcono.push('muchoFrio');
            }
            muchoFrio=true;

          }

          if(parseFloat(arrayHoras[i].windSpeed) > MAX_VIENTO){
            if(muchoViento===false){
              vm.AlarmaIcono.push('wind');
            }
            muchoViento=true;

          }

          if(arrayHoras[i].icon==='rain'){
            if(lluvia===false){
              vm.AlarmaIcono.push('rain');
            }
            lluvia=true;
          }else if(arrayHoras[i].icon==='snow'){
            if(nieve===false){
              vm.AlarmaIcono.push('snow');
            }
            nieve=true;
          }else if(arrayHoras[i].icon==='sleet'){
            if(aguanieve===false){
              vm.AlarmaIcono.push('sleet');
            }
            aguanieve=true;

          }

        }

        if(vm.AlarmaIcono.length===0){
          vm.AlarmaIcono.push('info'); // icono por defecto en alarma
        }
        $log.debug('alarmaicono',vm.AlarmaIcono)

        var frase='';
        if(lluvia || nieve || aguanieve){
          frase='Posibilidad de lluvia.';
          try {
            $cordovaVibration.vibrate([100, 500, 500, 500, 1000]);
          } catch (e) {

          }
          if(nieve || aguanieve){
            frase+='Posibilidad de nieve o aguanieve. ';
            try {
              $cordovaVibration.vibrate([1000, 1000, 3000, 1000, 5000]);

            } catch (e) {

            }
          }
        }
        if(muchoViento){
          frase+='hace mucho viento.'
          try {
            $cordovaVibration.vibrate(500);
          } catch (e) {

          }
        }
        if(muchoCalor){
          frase+='hace mucho calor.';
          try {
            $cordovaVibration.vibrate(500);
          } catch (e) {

          }
        }else if(muchoFrio){
          frase+='hace mucho frío.';
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
