app.component('requestErrors', {
    bindings: {
        errors: '='
    },
    template: '<div class="alert alert-danger" role="alert" ng-repeat="(key, value) in $ctrl.errors" ng-if="value"><p class="text-center">{{value}}</p></div>',
    controller: [requestErrorsController]
});

function requestErrorsController() {
    const $ctrl = this;

    $ctrl.$onInit = function () {
        for (var key in $ctrl.errors) {
            $ctrl.errors[key] = '';
        }
    };
}
