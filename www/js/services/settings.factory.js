(function() {
  'use strict';

  angular.module('app')
  .factory('settingsService', settingsService);
  settingsService.$inject = [];

  /* @ngInject */
  function settingsService() {
    var service = {
      settings: _settings
    };

    return service;

    function _settings(){
      return {
        units: 'si',
        days: 8,
        lang:'es',
        icono:'animado',
        live: false
      };
    }



  }
})();
