(function() {
  'use strict';

  angular.module('app')
  .factory('settingsService', settingsService);

  settingsService.$inject = [];

  /* @ngInject */
  function settingsService() {
    var settings = {
      units: 'si',
      days: 8,
      lang:'es',
      icono:'animado'
    };

      return settings;
  }
})();
