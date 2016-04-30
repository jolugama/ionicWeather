angular.module('App')
.controller('SearchController', SearchController);
SearchController.$inject=['$log','$timeout','$ionicPopup','geocodeService'];

function SearchController($log, $timeout, $ionicPopup, geocodeService) {
  var vm=this;
  vm.model = '';
  vm.bloqueo=false;
  vm.focusInput=true; //controla el foco del input de busqueda(a través de la directiva focusMe). si es true se focaliza.
  /**
  * abre una alerta ionic
  * @param  {string} titulo  titulo de la alerta
  * @param  {string} mensaje mensaje de la alerta
  */
  vm.alertPopup=function(titulo,mensaje){
    var alerta= $ionicPopup.alert({
      title: titulo,
      template: mensaje
    });
    alerta.then(function(){});
  };

  /**
  * [search description]
  * @param  {number} tiempo tiempo de respuesta para llamada al servicio. si es 0 es desde el boton, sino, mediante directiva on-change
  * @return {object} vm.results    contiene la dirección que se mostrará en la vista.
  */
  vm.search = function (tiempo) {
    if(vm.bloqueo===true){
      return;
    }
    vm.bloqueo=true;
    $timeout(function () {
      vm.bloqueo=false;
      var busqueda=vm.model;
      if( busqueda.indexOf(',')===-1 && busqueda.length>1){
        busqueda+=',es';
      }

      //llama a servicio geocode
      geocodeService.getGeocode(busqueda).then(function(response){
        vm.results=response.results;
        if(angular.isUndefined(vm.results)){
          angular.element('#upload').trigger('click');
          vm.alertPopup('houston','Ups, no nos llegan datos, inténtalo más tarde');
        }
      });

    }, tiempo);

  };
}
