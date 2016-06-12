(function() {
    'use strict';

    angular
        .module('app')
        .directive('iconoTiempo', iconoTiempo);

    /* @ngInject */
    function iconoTiempo() {
        var directive = {
            restrict: 'AE',
            templateUrl: 'views/iconosTemplate.html',
            scope: {
              tipoIcono: '@',
              clima: '@'

            },
            link: linkFunc
            // controller: Controller,
            // controllerAs: 'vm',
            // bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }


})();
