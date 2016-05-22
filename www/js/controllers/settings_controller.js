angular.module('App')
.controller('SettingsController', SettingsController);
SettingsController.$inject=['$scope','Settings','ubicacionesService'];

function SettingsController($scope,Settings, ubicacionesService){
  var vm=this;
  // funciones privadas
  var getStorage=function(){
    return angular.fromJson(localStorage.getItem('ionicWeather-config'));
  };
  var setStorage=function(data){
    localStorage.setItem('ionicWeather-config',angular.toJson(data));
  };
  // fin funciones privadas
  //
  vm.settings = getStorage() || Settings;


  vm.locations = ubicacionesService.data;
  vm.canDelete = false;




  vm.remove = function (index) {
    ubicacionesService.toggle(ubicacionesService.data[index]);
  };

  vm.guardaConfig=function(){
    setStorage(vm.settings);
  };



}
