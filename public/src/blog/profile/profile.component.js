app.component('profile', {
    templateUrl: 'build/views/blog/profile/profile.html',
    controller: ['profileService', '$stateParams', profileController],
    bindings: {
        authData: '<'
    }
});

function profileController(profileService, $stateParams) {
    const $ctrl = this;

    $ctrl.errorGettingMessages = profileService.errorGettingMessages;
    $ctrl.info = profileService.userInfo;

    profileService.getUserInfo($stateParams.userId);
}
