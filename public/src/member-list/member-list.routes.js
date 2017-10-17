app.config(['$stateProvider',
    ($stateProvider) => {
        $stateProvider.state('members', {
            url: "/",
            component: 'memberList',
            resolve: {
                authData: ['authService', (authService) => {
                        return authService.authData;
                    }
                ]
            }
        });
    }
]);
