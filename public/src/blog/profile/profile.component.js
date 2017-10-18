app.component('profile', {
    templateUrl: 'build/views/blog/profile/profile.html',
    controller: ['profileService', '$stateParams', profileController],
    bindings: {
        authData: '<'
    }
});

function profileController(profileService, $stateParams) {
    const $ctrl = this;

    profileService.getUserInfo($stateParams.userId);

    $ctrl.errorGettingMessages = profileService.notice.errorGettingMessages;
    $ctrl.info = profileService.userInfo;
}
