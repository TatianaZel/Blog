app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('members', {
        url: "/",
        component: 'memberList'
    });
}]);
