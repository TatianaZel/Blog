app.component('editProfile', {
    templateUrl: 'build/views/blog/profile/edit-profile.html',
    controller: ['profileService', 'localStorageService', '$state', editProfileController],
});

function editProfileController(profileService, localStorageService, $state) {
    const $ctrl = this;

    let userId = localStorageService.cookie.get('id');

    profileService.getUserInfo(userId);

    $ctrl.changePassword = changePassword;
    $ctrl.editProfileData = editProfileData;
    $ctrl.profileData = profileService.userInfo;
    $ctrl.notice = profileService.notice;

    function changePassword(data) {
        profileService.changePassword(data);
    }

    function editProfileData(data) {
        profileService.editProfileData(data);
    }
}
