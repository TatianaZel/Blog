app.config(['$stateProvider',
    ($stateProvider) => {
        $stateProvider.state('auth', {
            url: "/auth",
            component: 'auth',
            data: {
                auth: "Anonymous"
            }
        });
    }
]);
