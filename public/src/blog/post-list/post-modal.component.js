app.component('postModal', {
    templateUrl: 'build/views/blog/post-list/post-modal.html',
    bindings: {
        resolve: '<',
        close: '&'
    },
    controller: ['postListService', function (postListService) {
        const $ctrl = this;

        $ctrl.blogReqData = postListService.reqData;

        $ctrl.createPost = function () {
            postListService.createPost($ctrl.postData).then($ctrl.close);
        };
    }]
});
