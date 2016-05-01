
angular.module('App')
.factory('ubicacionesService',ubicacionesService);
ubicacionesService.$inject=['$ionicPopup'];

function ubicacionesService($ionicPopup){

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
            that.setStorage(that.data);
          }
        });
      } else {
        that.data.push(item);
        that.setStorage(that.data);
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
      that.setStorage(that.data);
    },
    getStorage: function(){
      return angular.fromJson(localStorage.getItem('ionicWeather-data'));
    },
    setStorage: function(data){
      localStorage.setItem('ionicWeather-data',angular.toJson(data));
    }
  };
  ubicaciones.data=ubicaciones.getStorage();
  return ubicaciones;
}
