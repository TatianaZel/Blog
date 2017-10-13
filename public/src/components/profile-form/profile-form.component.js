app.component('profileForm', {
    bindings: {
        title: '@',
        isSendingNow: '<',
        profile: '<',
        submitFunc: '<',
        errors: '<'
    },
    templateUrl: 'build/views/components/profile-form/profile-form.html',
    controller: [profileFormController]
});

function profileFormController() {
    const $ctrl = this;
}
