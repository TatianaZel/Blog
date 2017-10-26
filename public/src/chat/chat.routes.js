app.config(['$stateProvider',
    ($stateProvider) => {
        $stateProvider.state('chat', {
            url: "/chat",
            component: 'chat',
            data: {
                auth: "Authorized"
            }
        });
    }
]);
