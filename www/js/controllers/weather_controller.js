angular.module('App')
.controller('WeatherController', WeatherController);
WeatherController.$inject=['$scope','$window','$log', '$stateParams', '$ionicPlatform', '$ionicLoading', '$ionicActionSheet', '$ionicModal', '$timeout', 'ubicacionesService', 'Settings', 'forecastService'];

function WeatherController($scope, $window, $log, $stateParams, $ionicPlatform, $ionicLoading, $ionicActionSheet, $ionicModal, $timeout, ubicacionesService, Settings, forecastService){

  var vm=this;
  vm.carga=false;
  vm.params = $stateParams;  //parametros que se han pasado desde la vista search con ui-sref, en app.js url: '/weather/:city/:lat/:lng'
  vm.settings = Settings;



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
    console.log('llamando al refresco');
    //llama a servicio forecast
    forecastService.getForecast(vm.params,vm.settings).then(function(response){
      vm.forecast = response;
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
      vm.loadingClose();

    });
  };

vm.refrescar();


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
        {text: 'Calendario solar'}
      ],
      cancelText: 'Cancel',
	cancel: function() {
		$log.debug('CANCELLED');
  },

      buttonClicked: function (index) {
        if (index === 0) {
          ubicacionesService.toggle($stateParams);
        }
        if (index === 1) {
          ubicacionesService.primary($stateParams);
        }
        if (index === 2) {
          vm.showModal();
        }
        return true;
      }
    });
  };


  vm.showModal = function () {
    if (vm.modal) {
      vm.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/modal-chart.html', {
        scope: $scope
      }).then(function (modal) {
        vm.modal = modal;
        var days = [];
        var day = Date.now();
        for (var i = 0; i < 365; i++) {
          day += 1000 * 60 * 60 * 24;
          days.push(SunCalc.getTimes(day, vm.params.lat, vm.params.lng));
        }
        $scope.chart = days;
        vm.modal.show();
      });
    }
  };
  $scope.hideModal = function () {
    vm.modal.hide();
  };
  $scope.$on('$destroy', function() {
    //  vm.modal.remove();
  });
  return vm;
}
