angular.module('App')
.controller('SettingsController', SettingsController);
SettingsController.$inject=['Settings','ubicacionesService'];

function SettingsController(Settings, ubicacionesService){
  var vm=this;
  vm.settings = Settings;
  vm.locations = ubicacionesService.data;
  vm.canDelete = false;

  vm.remove = function (index) {
    ubicacionesService.toggle(ubicacionesService.data[index]);
  };
}
