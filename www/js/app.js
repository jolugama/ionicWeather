// Ionic Starter app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function() {
  angular.module('app', ['ionic','ngCordova','ngAnimate'])
  .config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
    .state('search', {
      url: '/search',
      controller: 'SearchController',
      controllerAs: 's',
      templateUrl: 'views/search.html'
    })
    .state('settings', {
      url: '/settings',
      cache: false,
      controller: 'SettingsController',
      controllerAs: 'st',
      templateUrl: 'views/settings.html'
    })
    .state('weather', {
      url: '/weather/:city/:lat/:lng',
      cache: false,
      controller: 'WeatherController',
      controllerAs: 'w',
      templateUrl: 'views/weather.html'
    })
    .state('weather2', {
      url: '/weather2/:city/:lat/:lng',
      cache: false,
      controller: 'WeatherController',
      controllerAs: 'w',
      templateUrl: 'views/weather2.html'
    })
    ;

    $urlRouterProvider.otherwise('/search');
  })
  .run(function($ionicPlatform,$ionicPopup) {
    $ionicPlatform.ready(function() {

      // Check for network connection
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: 'Sin conexión a internet',
            content: 'Ups!, No hay conexión a internet, inténtalo más tarde'
          })
          .then(function(result) {
            if(!result) {
              ionic.Platform.exitApp();
            }
          });
        }
      }

      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

})();
