app.component('postModal', {
    templateUrl: 'build/views/blog/post-list/post-modal.html',
    bindings: {
        resolve: '<',
        close: '&'
    },
    controller: ['postListService', (postListService) => {
            const $ctrl = this;

            $ctrl.blogReqData = postListService.reqData;
                console.log($ctrl.resolve);
            $ctrl.submit = function () {

                $ctrl.resolve.submitFunc($ctrl.postData).then($ctrl.close);
            };
        }
    ]
});
