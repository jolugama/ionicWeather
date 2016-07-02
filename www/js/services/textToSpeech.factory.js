(function() {
  'use strict';

  angular
  .module('app')
  .factory('ttsService', ttsService);

  ttsService.$inject = ['utils','$log','settingsService'];

  /* @ngInject */
  function ttsService(utils,$log,settingsService) {
    var service = {
      habla: _habla
    };

    return service;

    function _habla(texto) {
      if(texto && texto.length>1){
        var settings = utils.getStorage('config');
        var local='';
        var voz='';
        var locales=[];
        var voces;
        var idioma;
        if(settings && settings.lang){
          idioma=settings.lang;
        }else{
          idioma=settingsService.lang;
        }
        if(idioma==='es'){
          locales=['es-ES'];
          local=locales[Math.floor(Math.random() * locales.length)];
          voces=['Spanish Female']; //'Spanish Latin American Female'
          voz = voces[Math.floor(Math.random() * voces.length)];
        }else if(settings.lang==='en'){
          locales=['en-EN','en-US','en-GB'];
          local=locales[Math.floor(Math.random() * locales.length)];
          voces=['UK English Female','UK English Male','US English Female','Australian Female','US English Male'];
          voz = voces[Math.floor(Math.random() * voces.length)];
        }

        try {
          // basic usage
          TTS.speak({
            text: texto,
            locale: local,
            rate: 1.2
          }, function () {
            // Do Something after success
          }, function (error) {
            // Handle the error case
          });
        } catch (e) {
          try {
            //en caso de no usar android ni ios, en pc escritorio

            responsiveVoice.speak(texto,voz,{rate: 1.2}); //pitch: 0.9
          } catch (ee) {
          }

        } finally {

        }
      }

    }
    habla('..');
  }
})();
