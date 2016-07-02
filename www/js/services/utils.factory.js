(function() {
  'use strict';

  angular
  .module('app')
  .factory('utils', utils);

  utils.$inject = [];

  /* @ngInject */
  function utils() {
    var service = {
      getStorage: _getStorage,
      setStorage: _setStorage
    };

    return service;


    function _getStorage(tipo){
      return tipo==='config' ? angular.fromJson(localStorage.getItem('ionicWeather-config')) : angular.fromJson(localStorage.getItem('ionicWeather-data'));
    }
    function _setStorage(tipo,data){
      var nameLocalStorage='';
      if(tipo==='config'){
        nameLocalStorage='ionicWeather-config'
      }else{
        nameLocalStorage='ionicWeather-data';
      }
      localStorage.setItem(nameLocalStorage,angular.toJson(data));
    }
  }
})();
