app.component('layout', {
    templateUrl: 'build/views/layout/layout.html',
    controller: ['authService', layoutController]
});

function layoutController(authService) {
    const $ctrl = this;

    $ctrl.authData = authService.authData;
    $ctrl.errorSignOutMessages = authService.errorSignOutMessages;
    $ctrl.signOut = authService.signOut;
}
