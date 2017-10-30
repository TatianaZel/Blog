app.config(['$stateProvider',
    ($stateProvider) => {
        $stateProvider.state('chat', {
            url: "/chat/:chatId",
            component: 'chat',
            data: {
                auth: "Authorized"
            }
        });
    }
]);
