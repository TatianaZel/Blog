app.component('notice', {
    bindings: {
        notice: '=',
        danger: '<'
    },
    templateUrl:'build/views/components/notice.html',
    controller: [noticeController]
});

function noticeController() {
    const $ctrl = this;

    $ctrl.$onInit = function () {
        for (var key in $ctrl.notice) {
            $ctrl.notice[key] = '';
        }
    };
}
