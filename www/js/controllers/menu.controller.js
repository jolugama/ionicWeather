(function() {
  'use strict';

  angular
  .module('app')
  .controller('MenuController', MenuController);

  MenuController.$inject = ['ubicacionesService'];

  /* @ngInject */
  function MenuController(ubicacionesService) {
    var vm = this;

    vm.ubicaciones = ubicacionesService.data;
    vm.esAndroid=false;
    if(ionic && ionic.Platform){
      vm.esAndroid=ionic.Platform.isAndroid();
    }
    
  }
})();
