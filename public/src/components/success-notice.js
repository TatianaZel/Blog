app.component('successNotice', {
    bindings: {
        errors: '='
    },
    template: '<div class="alert alert-danger" role="alert" ng-repeat="(key, value) in $ctrl.errors" ng-if="value"><p class="text-center">{{value}}</p></div>',
    controller: [failedNoticeController]
});

function successNoticeController() {
    const $ctrl = this;

    $ctrl.$onInit = function () {
        for (var key in $ctrl.errors) {
            $ctrl.errors[key] = '';
        }
    };
}
