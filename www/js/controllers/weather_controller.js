angular.module('App')
.controller('WeatherController', WeatherController);
WeatherController.$inject=['$scope', '$stateParams', '$ionicPlatform', '$ionicActionSheet', '$ionicModal', 'ubicacionesService', 'Settings', 'forecastService'];

function WeatherController($scope, $stateParams,   $ionicPlatform, $ionicActionSheet, $ionicModal, ubicacionesService, Settings, forecastService){


  $scope.carga=false;
  var vm=this;
  vm.params = $stateParams;  //parametros que se han pasado desde la vista search con ui-sref, en app.js url: '/weather/:city/:lat/:lng'
  vm.settings = Settings;



  //slider
  vm.optionsSlider = {
    loop: false,
    speed: 400
  }
  vm.dataSlider = {};
  $scope.$watch('data.slider', function(nv, ov) {
    vm.slider = vm.dataSlider.slider;
  })
  //fin slider


  //llama a servicio forecast
  $scope.carga=forecastService.getForecast(vm.params,vm.settings).then(function(response){
    vm.forecast = response;
  });

  vm.refrescar = function() {
    console.log('llamando al refresco')
    //llama a servicio forecast
    $scope.carga=forecastService.getForecast(vm.params,vm.settings).then(function(response){
      vm.forecast = response;
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };


  var barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;
  vm.getWidth = function () {
    return window.innerWidth + 'px';
  };
  vm.getTotalHeight = function () {
    return parseInt(parseInt(vm.getHeight()) * 3) + 'px';
  };
  vm.getHeight = function () {
    return parseInt(window.innerHeight - barHeight) + 'px';
  };
  vm.showOptions = function () {
    var sheet = $ionicActionSheet.show({
      buttons: [
        {text: 'Guardar a favoritos'},
        {text: 'Seleccionar como primario'},
        {text: 'Calendario solar'}
      ],
      cancelText: 'Cancelar',
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
