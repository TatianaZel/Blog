app.component('layout', {
    templateUrl: 'build/views/layout/layout.html',
    controller: ['authService', '$state', layoutController]
});

function layoutController(authService, $state) {
    const $ctrl = this;

    $ctrl.authData = authService.authData;
    $ctrl.errorSignOutMessages = authService.errorSignOutMessages;
    $ctrl.signOut = signOut;

    function signOut() { //////временное решение
        authService.signOut().then(() => {
            $state.go('members', {userId: authService.authData.userId});
        });
    }
}
