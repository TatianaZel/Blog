app.config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.state('member', {
            url: "/:userId",
            component: 'blog',
            resolve: {
                authData: ['authService',
                    (authService) => {
                        return authService.authData;
                    }
                ]
            }
        });

        $stateProvider.state('editProfile', {
            url: "/editProfile",
            component: 'editProfile',
            data: {
                auth: "Authorized"
            }
        });
    }
]);
