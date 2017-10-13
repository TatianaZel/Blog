'use strict';

var app = angular.module('app', ['ui.router', 'ui.router.state.events', 'LocalStorageModule', 'ui.bootstrap']).run(['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.data && toState.data.auth) {
            if (toState.data.auth === 'Anonymous' && localStorageService.cookie.get('token')) {
                event.preventDefault();
                return false;
            }
            if (toState.data.auth === 'Authorized' && !localStorageService.cookie.get('token')) {
                event.preventDefault();
                return false;
            }
        }
    });
}]);