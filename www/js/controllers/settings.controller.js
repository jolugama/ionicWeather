
(function() {
  'use strict';

  angular.module('app')
  .controller('SettingsController', SettingsController);
  SettingsController.$inject=['$scope','settingsService','ubicacionesService','utils'];

  /* @ngInject */
  function SettingsController($scope,settingsService, ubicacionesService, utils){
    var vm=this;


    vm.settings = utils.getStorage('config') || settingsService;


    vm.locations = ubicacionesService.data;
    vm.canDelete = false;


    vm.remove = function (index) {
      ubicacionesService.toggle(ubicacionesService.data[index]);
    };

    vm.guardaConfig=function(){
      utils.setStorage('config',vm.settings);
    };

  }
  
})();
