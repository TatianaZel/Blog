app.component('auth', {
    templateUrl: 'build/views/auth/auth.html',
    controller: ['authService', '$state', authController]
});

function authController(authService, $state) {
    const $ctrl = this;

    $ctrl.errorSignInMessages = authService.errorSignInMessages;
    $ctrl.errorSignUpMessages = authService.errorSignUpMessages;
    $ctrl.reqAuthData = authService.reqData;
    $ctrl.signIn = signIn;
    $ctrl.signUp = signUp;

    function signUp(userData) {
        authService.signUp(userData).then(() => {
            $state.go('member', {userId: authService.authData.id});
        });
    }

    function signIn(userData) {
        authService.signIn(userData).then(() => {
            $state.go('member', {userId: authService.authData.id});
        });
    }
}
