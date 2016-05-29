(function() {
  'use strict';

  angular.module('app')
  .factory('ubicacionesService',ubicacionesService);
  ubicacionesService.$inject=['$ionicPopup','utils'];

  /* @ngInject */
  function ubicacionesService($ionicPopup,utils){

    var ubicaciones = {
      data: [],
      getIndex: function (item) {
        var that=this;
        var index = -1;
        angular.forEach(that.data, function (ubicacion, i) {
          if (item.lat == ubicacion.lat && item.lng == ubicacion.lng) {
            index = i;
          }
        });
        return index;
      },
      toggle: function (item) {
        var that=this;
        var index = that.getIndex(item);
        if (index >= 0) {
          $ionicPopup.confirm({
            title: 'Esta seguro?',
            template: 'Vas a remover ' + that.data[index].city
          }).then(function (res) {
            if (res) {
              that.data.splice(index, 1);
              utils.setStorage('data',that.data);
            }
          });
        } else {
          that.data.push(item);
          utils.setStorage('data',that.data);
          $ionicPopup.alert({
            title: 'Guardado en favoritos'
          });
        }
      },
      primary: function (item) {
        var that=this;
        var index = that.getIndex(item);
        if (index >= 0) {
          that.data.splice(index, 1);
          that.data.splice(0, 0, item);
        } else {
          that.data.unshift(item);
        }
        utils.setStorage('data',that.data);
      }
    };
    if(utils.getStorage('data')){
      ubicaciones.data=utils.getStorage('data');
    }

    return ubicaciones;
  }

})();
