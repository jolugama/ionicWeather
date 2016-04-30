angular.module('App')
.controller('SettingsController', SettingsController);
SettingsController.$inject=['$scope','Settings','ubicacionesService'];

function SettingsController($scope,Settings, ubicacionesService){
  var vm=this;
  vm.settings = Settings;
  vm.locations = ubicacionesService.data;
  vm.canDelete = false;

  vm.remove = function (index) {
    ubicacionesService.toggle(ubicacionesService.data[index]);
  };
}
