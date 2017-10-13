app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('auth', {
        url: "/auth",
        component: 'auth',
        data: {
            auth: "Anonymous"
        }
    });
}]);
