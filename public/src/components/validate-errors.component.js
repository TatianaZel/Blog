app.component('validateErrors', {
    bindings: {
        errors: '<',
        show: '<'
    },
    template: '<div class="text-danger" ng-repeat="(key, value) in $ctrl.errors" ng-if="$ctrl.messageToggle(key)">{{$ctrl.messages[key]}}</div>',
    controller: [validateErrorsController]
});

function validateErrorsController() {
    const $ctrl = this;

    $ctrl.messages = {
        required: '* This field is required',
        minlength: '* Too short value',
        maxlength: '* Too long value',
        email: '* Email is not valid',
        confirm: '* Passwords are not the same'
    };
    $ctrl.messageToggle = messageToggle;

    function messageToggle(key) {
        if (key === 'confirm' && Object.keys($ctrl.errors).length > 1)
            return false;

        if ($ctrl.show)
            return true;

        return false;
    }
}
