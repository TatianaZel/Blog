app.config(['$urlRouterProvider',
    ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/');
    }
]);
